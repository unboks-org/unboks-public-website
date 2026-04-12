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

const ACTIVE_STYLES: Record<PlatformKey, string> = {
  whatsapp: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  x: "bg-foreground/10 text-foreground border-foreground/20",
  instagram: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  tiktok: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  facebook: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export function PlatformFilterBar({ className }: { className?: string }) {
  const { selected, toggle, clear, isAll } = usePlatformFilter();

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      <button
        onClick={clear}
        className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
          isAll
            ? "bg-primary/15 text-primary border-primary/30"
            : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:border-border"
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
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              active
                ? ACTIVE_STYLES[p.key]
                : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:border-border"
            )}
          >
            <Icon className="w-3 h-3" />
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
