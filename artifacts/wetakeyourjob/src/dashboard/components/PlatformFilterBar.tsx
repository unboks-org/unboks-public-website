import { usePlatformFilter } from "@dashboard/hooks/use-platform-filter";
import { PLATFORMS, type PlatformKey } from "@dashboard/lib/channel-map";
import { cn } from "@dashboard/lib/utils";
import { Phone, Twitter, Instagram, Facebook, Music2 } from "lucide-react";

const ICONS: Record<PlatformKey, React.ElementType> = {
  whatsapp: Phone,
  x: Twitter,
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
};

export function PlatformFilterBar({ className }: { className?: string }) {
  const { selected, toggle, clear, isAll } = usePlatformFilter();

  return (
    <div className={cn("flex items-center gap-1.5 px-1", className)}>
      <button
        onClick={clear}
        className={cn(
          "flex items-center h-7 px-3 rounded-full text-[13px] font-medium transition-colors duration-100 shrink-0",
          isAll
            ? "bg-white/[0.11] text-foreground"
            : "text-foreground/55 hover:text-foreground/85 hover:bg-white/[0.06]"
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
              "flex items-center gap-1.5 h-7 px-3 rounded-full text-[13px] font-medium transition-colors duration-100 shrink-0",
              active
                ? "bg-white/[0.11] text-foreground"
                : "text-foreground/55 hover:text-foreground/85 hover:bg-white/[0.06]"
            )}
          >
            <Icon className="w-3 h-3 shrink-0" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
