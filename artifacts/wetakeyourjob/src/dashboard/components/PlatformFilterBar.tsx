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
    <div className={cn("flex items-center", className)}>
      <button
        onClick={clear}
        className={cn(
          "relative flex items-center h-full px-3 text-[15px] transition-colors duration-100 shrink-0",
          isAll
            ? "text-foreground font-medium"
            : "text-foreground/80 dark:text-foreground/65 hover:text-foreground/95 dark:hover:text-foreground/90"
        )}
      >
        All
        {isAll && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/90 rounded-t-full" />
        )}
      </button>

      {PLATFORMS.map((p) => {
        const Icon = ICONS[p.key];
        const active = selected.has(p.key);
        return (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className={cn(
              "relative flex items-center gap-1.5 h-full px-3 text-[15px] transition-colors duration-100 shrink-0",
              active
                ? "text-foreground font-medium"
                : "text-foreground/80 dark:text-foreground/65 hover:text-foreground/95 dark:hover:text-foreground/90"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{p.label}</span>
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/90 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
