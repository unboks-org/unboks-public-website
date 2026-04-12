export type PlatformKey = "whatsapp" | "x" | "instagram" | "tiktok" | "facebook";

export interface PlatformDef {
  key: PlatformKey;
  label: string;
  channels: string[];
  color: string;
}

export const PLATFORMS: PlatformDef[] = [
  { key: "whatsapp", label: "WhatsApp", channels: ["whatsapp"], color: "emerald" },
  { key: "x", label: "X", channels: ["twitter_dm"], color: "slate" },
  { key: "instagram", label: "Instagram", channels: ["instagram_dm"], color: "pink" },
  { key: "tiktok", label: "TikTok", channels: ["tiktok_dm"], color: "cyan" },
  { key: "facebook", label: "Facebook", channels: ["facebook_dm"], color: "blue" },
];

export function channelToPlatformKey(channel?: string): PlatformKey | null {
  if (!channel) return null;
  for (const p of PLATFORMS) {
    if (p.channels.includes(channel)) return p.key;
  }
  return null;
}

export function matchesPlatformFilter(
  channel: string | undefined,
  selected: Set<PlatformKey>,
): boolean {
  if (selected.size === 0) return true;
  const pk = channelToPlatformKey(channel);
  return pk !== null && selected.has(pk);
}
