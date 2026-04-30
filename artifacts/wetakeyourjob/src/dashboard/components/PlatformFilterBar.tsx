import { usePlatformFilter } from "@dashboard/hooks/use-platform-filter";
import { PLATFORMS, type PlatformKey } from "@dashboard/lib/channel-map";
import { cn } from "@dashboard/lib/utils";
import { Phone, Instagram, Facebook, Music2 } from "lucide-react";
import { XBrandIcon } from "@dashboard/components/ui/x-brand-icon";

const ICONS: Record<PlatformKey, React.ElementType> = {
  whatsapp: Phone,
  x: XBrandIcon,
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
};

const LABELS: Record<PlatformKey, string> = {
  whatsapp: "WhatsApp",
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export function PlatformFilterBar() {
  const { selected, toggle, clear, isAll } = usePlatformFilter();

  return (
    <div className="flex items-center gap-1.5 px-4 h-full overflow-x-auto scrollbar-none">
      <button
        onClick={clear}
        className={cn(
          "flex items-center h-[26px] px-3 text-[12px] font-medium rounded-md border transition-colors shrink-0 whitespace-nowrap",
          isAll
            ? "bg-white border-[#d0d7de] text-[#24292f] font-semibold shadow-sm"
            : "border-transparent text-[#57606a] hover:bg-[#d0d7de]/50 hover:text-[#24292f] hover:border-[#d0d7de]"
        )}
      >
        All
      </button>

      <div className="w-px h-4 bg-[#d0d7de] shrink-0 mx-1" />

      {PLATFORMS.map((p) => {
        const Icon = ICONS[p.key];
        const active = selected.has(p.key);
        return (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className={cn(
              "flex items-center gap-1.5 h-[26px] px-3 text-[12px] font-medium rounded-md border transition-colors shrink-0 whitespace-nowrap",
              active
                ? "bg-white border-[#d0d7de] text-[#24292f] font-semibold shadow-sm"
                : "border-transparent text-[#57606a] hover:bg-[#d0d7de]/50 hover:text-[#24292f] hover:border-[#d0d7de]"
            )}
          >
            <Icon className="w-[13px] h-[13px] shrink-0 text-[#57606a]" />
            <span>{LABELS[p.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
