/**
 * Proxy for Zoho contact form submission.
 * Forwards POST form data to Zoho to avoid CORS when submitting from the browser.
 * Returns the JSON response (e.g. inlineMessage) to the client.
 */

import { NextResponse } from "next/server";

const ZOHO_FORM_ACTION =
  "https://krew-zgp4.maillist-manage.in/weboptin.zc";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    formData.delete("zc_spmSubmit");

    // Convert FormData to URLSearchParams for application/x-www-form-urlencoded
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, value.toString());
    });

    const res = await fetch(ZOHO_FORM_ACTION, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    const rawText = await res.text();
    let data: Record<string, unknown> = {};

    // Zoho often returns JSON wrapped in HTML like: <div>##ZCJSONSTART##{...}##ZCJSON##</div>
    const jsonMatch = rawText.match(/##ZCJSONSTART##([\s\S]*?)##ZCJSON##/);

    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[1]);
        // If we found the JSON marker, it's generally a successful submission/acknowledgment
        data.isZohoJson = true;
      } catch (e) {
        console.error("Failed to parse extracted Zoho JSON:", e);
      }
    } else {
      try {
        data = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
      } catch {
        // Not JSON and no Zoho JSON marker
        data = {};
      }
    }

    // Determine if it's a success based on content if not already clear
    const isSuccess = res.ok || rawText.includes("successfully subscribed") || rawText.includes("confirmation link");

    return NextResponse.json(
      {
        ...data,
        success: isSuccess,
        inlineMessage: isSuccess ? "Thank you for your submission!" : undefined,
        rawResponse: rawText
      },
      { status: isSuccess ? 200 : res.status }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission failed";
    return NextResponse.json(
      { rawResponse: message, error: message },
      { status: 500 }
    );
  }
}
