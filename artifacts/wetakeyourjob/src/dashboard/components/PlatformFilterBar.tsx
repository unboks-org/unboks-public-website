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
          "flex items-center h-[34px] px-3.5 rounded-full text-[13px] font-medium transition-all duration-100 shrink-0 border",
          isAll
            ? "bg-primary/10 text-primary border-primary/25"
            : "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground"
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
              "flex items-center gap-1.5 h-[34px] px-3.5 rounded-full text-[13px] font-medium transition-all duration-100 shrink-0 border",
              active
                ? "bg-primary/10 text-primary border-primary/25"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
