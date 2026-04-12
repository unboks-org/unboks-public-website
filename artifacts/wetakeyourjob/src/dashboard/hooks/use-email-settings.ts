import { useState, useCallback } from "react";

const EMAIL_KEY = "bluemarlin_email_settings";

export interface EmailSettings {
  enabled: boolean;
  client: "gmail" | "mailto";
}

const DEFAULT: EmailSettings = { enabled: false, client: "gmail" };

export function useEmailSettings() {
  const load = (): EmailSettings => {
    try {
      const raw = localStorage.getItem(EMAIL_KEY);
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    } catch { return DEFAULT; }
  };

  const [settings, setSettings] = useState<EmailSettings>(load);

  const save = useCallback((next: EmailSettings) => {
    localStorage.setItem(EMAIL_KEY, JSON.stringify(next));
    setSettings(next);
  }, []);

  return { settings, save };
}

export function openEmailCompose(
  settings: EmailSettings,
  to: string,
  subject: string,
  body: string
) {
  if (settings.client === "gmail") {
    const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  } else {
    window.open(`mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  }
}
