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

const segmentBase =
  "flex items-center h-8 px-3 rounded-[10px] text-[13px] font-medium transition-all duration-150 shrink-0 select-none";

const segmentActive =
  "bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.10)] border border-[rgba(226,232,240,0.9)]";

const segmentInactive =
  "bg-transparent text-[#64748B] border border-transparent hover:bg-white/70 hover:text-[#0F172A]";

export function PlatformFilterBar() {
  const { selected, toggle, clear, isAll } = usePlatformFilter();

  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA]">
      <button
        onClick={clear}
        className={cn(segmentBase, isAll ? segmentActive : segmentInactive)}
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
            className={cn(segmentBase, "gap-[7px]", active ? segmentActive : segmentInactive)}
          >
            <Icon className="w-[14px] h-[14px] shrink-0" />
            {p.key !== "x" && <span>{p.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
