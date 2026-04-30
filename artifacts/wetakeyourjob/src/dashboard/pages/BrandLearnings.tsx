import { useLearnings, useLearningMutations } from "@dashboard/hooks/use-client-api";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { Card } from "@dashboard/components/ui/card";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { BrainCircuit, Trash2, AlertCircle, Quote, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";

export default function BrandLearnings() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { data: learnings, isLoading, error, refetch } = useLearnings();
  const { distill, remove } = useLearningMutations();

  return (
    <div className="space-y-8">
      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-primary/20 bg-primary/5">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <BrainCircuit className="text-primary w-8 h-8" />
            Brand Rules
          </h1>
          <p className="text-primary/80 max-w-2xl text-sm leading-relaxed">
            Rules are built from your approvals, rejections, and edits to keep your content on-brand.
            They are applied automatically to all future content created for your channels.
          </p>
        </div>
        <Button
          onClick={() => distill.mutate()}
          disabled={distill.isPending}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0 font-semibold"
        >
          {distill.isPending ? "Updating…" : "Update Brand Rules"}
        </Button>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={() => refetch()} title="Failed to load learnings" />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl glass-card" />)}
        </div>
      ) : learnings?.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground">No learnings distilled yet</h3>
          <p className="text-muted-foreground mt-2">Reject some drafts with feedback, then distill learnings to generate rules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {learnings?.map((learning, i) => (
            <motion.div
              key={learning.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full border-l-4 border-l-teal-500 border-t border-r border-b border-border/70 shadow-sm hover:shadow-md bg-teal-50/50 dark:bg-teal-950/20 transition-all flex flex-col group overflow-hidden">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3">
                    <Quote className="w-4 h-4 text-teal-700 dark:text-teal-300 rotate-180" />
                  </div>
                  <p className="text-foreground text-base font-medium leading-snug flex-1 mb-6">
                    {learning.rule}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-teal-200/60 dark:border-teal-800/40">
                    <div className="flex flex-col">
                      <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold">Distilled</span>
                      <span className="text-xs text-foreground/60">
                        {formatDistanceToNow(new Date(learning.created_at), {addSuffix: true})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-teal-700/60 dark:text-teal-400/60 bg-teal-100 dark:bg-teal-500/10 px-2 py-1 rounded">
                        Sources: {learning.source_draft_ids.join(', ')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove.mutate(learning.id)}
                        disabled={remove.isPending}
                        className="w-8 h-8 text-muted-foreground/60 hover:text-rose-400 hover:bg-rose-500/10 ml-2"
                        title="Deactivate Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
