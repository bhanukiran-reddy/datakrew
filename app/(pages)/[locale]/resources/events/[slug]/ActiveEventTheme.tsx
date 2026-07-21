"use client";

import { useEffect } from "react";

export default function ActiveEventTheme() {
    useEffect(() => {
        document.documentElement.classList.add("active-event-page");
        return () => {
            document.documentElement.classList.remove("active-event-page");
        };
    }, []);
    return null;
}
