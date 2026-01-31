"use client";

import { useEffect } from "react";
import { getTheme, setTheme } from "@/lib/theme";

export function ThemeScript() {
  useEffect(() => {
    const theme = getTheme();
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var theme = localStorage.getItem('sampisilver-theme') || 
              (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', theme === 'dark');
          })();
        `,
      }}
    />
  );
}
