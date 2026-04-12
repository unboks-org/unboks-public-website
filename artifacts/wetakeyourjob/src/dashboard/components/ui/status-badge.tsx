import { DraftStatus, ContentClass } from "@dashboard/lib/api";
import { cn } from "@dashboard/lib/utils";

const statusConfig: Record<DraftStatus, { dot: string; text: string; bg: string; border: string; label: string }> = {
  pending: {
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Pending",
  },
  approved: {
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Approved",
  },
  rejected: {
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    label: "Rejected",
  },
  published: {
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    label: "Published",
  },
  scheduled: {
    dot: "bg-purple-500",
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    label: "Scheduled",
  },
  deleted: {
    dot: "bg-zinc-500",
    text: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-500/8",
    border: "border-zinc-500/15",
    label: "Deleted",
  },
};

export function StatusBadge({ status, className }: { status: DraftStatus; className?: string }) {
  const cfg = statusConfig[status] ?? statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        cfg.bg,
        cfg.border,
        cfg.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

const classConfig: Record<ContentClass, { bg: string; text: string; border: string }> = {
  A: { bg: "bg-sky-500/12",    text: "text-sky-600 dark:text-sky-400",      border: "border-sky-500/20" },
  B: { bg: "bg-emerald-500/12",text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
  C: { bg: "bg-orange-500/12", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/20" },
  D: { bg: "bg-purple-500/12", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20" },
};

export function ClassBadge({ contentClass, className }: { contentClass: ContentClass; className?: string }) {
  const cfg = classConfig[contentClass];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold border",
        cfg.bg,
        cfg.text,
        cfg.border,
        className
      )}
    >
      {contentClass}
    </span>
  );
}
