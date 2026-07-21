type EmailLinkProps = {
  email: string;
  children?: string;
  className?: string;
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * mailto link wrapped in Cloudflare <!--email_off--> so href stays mailto:
 * (avoids /cdn-cgi/l/email-protection 404s in SEO crawlers).
 */
export default function EmailLink({ email, children, className }: EmailLinkProps) {
  const label = escapeHtml(children ?? email);
  const classAttr = className ? ` class="${escapeHtml(className)}"` : '';

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!--email_off--><a href="mailto:${escapeHtml(email)}"${classAttr}>${label}</a><!--/email_off-->`,
      }}
    />
  );
}
