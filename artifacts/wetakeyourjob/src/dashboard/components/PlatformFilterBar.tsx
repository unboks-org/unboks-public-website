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
    <div className="flex items-stretch h-full overflow-x-auto scrollbar-none">
      <button
        onClick={clear}
        className={cn(
          "relative flex items-center h-full px-[24px] text-[13px] font-semibold shrink-0 whitespace-nowrap transition-colors border-b-[3px]",
          isAll
            ? "text-[#1677F2] border-[#1677F2]"
            : "text-[#5F6368] border-transparent hover:text-[#202124] hover:bg-[#F8FAFC]"
        )}
      >
        All
      </button>

      {PLATFORMS.map((p) => {
        const Icon = ICONS[p.key];
        const active = selected.has(p.key);
        return (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className={cn(
              "relative flex items-center gap-2 h-full px-[24px] text-[13px] font-semibold shrink-0 whitespace-nowrap transition-colors border-b-[3px]",
              active
                ? "text-[#1677F2] border-[#1677F2]"
                : "text-[#5F6368] border-transparent hover:text-[#202124] hover:bg-[#F8FAFC]"
            )}
          >
            <Icon className={cn("w-[15px] h-[15px] shrink-0", active ? "text-[#1677F2]" : "text-[#9AA0A6]")} />
            <span>{LABELS[p.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
