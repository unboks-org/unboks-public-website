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

export function PlatformFilterBar({ className }: { className?: string }) {
  const { selected, toggle, clear, isAll } = usePlatformFilter();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={clear}
        className={cn(
          "flex items-center h-[36px] px-[13px] rounded-full text-[14px] font-medium transition-all duration-100 shrink-0 border",
          isAll
            ? "bg-[#EAF3FF] text-[#1677F2] border-[rgba(22,119,242,0.20)]"
            : "bg-[#F5F7FA] text-[#64748B] border-[#E2E8F0] hover:bg-[#EEF2F7] hover:text-[#0F172A]"
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
              "flex items-center gap-[7px] h-[36px] px-[13px] rounded-full text-[14px] font-medium transition-all duration-100 shrink-0 border",
              active
                ? "bg-[#EAF3FF] text-[#1677F2] border-[rgba(22,119,242,0.20)]"
                : "bg-[#F5F7FA] text-[#64748B] border-[#E2E8F0] hover:bg-[#EEF2F7] hover:text-[#0F172A]"
            )}
          >
            <Icon className="w-[15px] h-[15px] shrink-0" />
            {p.key !== "x" && <span>{p.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
