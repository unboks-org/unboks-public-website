import { useLearnings, useLearningMutations } from "@dashboard/hooks/use-client-api";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { Trash2, AlertCircle, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGoBack } from "@dashboard/hooks/use-go-back";

export default function BrandLearnings() {
  const goBack = useGoBack();
  const { data: learnings, isLoading, error, refetch } = useLearnings();
  const { distill, remove } = useLearningMutations();

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={goBack} className="flex items-center gap-1.5 text-[13px] text-[#57606a] hover:text-[#24292f] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#d0d7de] bg-white p-5">
        <div>
          <h1 className="text-[18px] font-semibold text-[#24292f] mb-1">Brand Rules</h1>
          <p className="text-[13px] text-[#57606a] max-w-2xl leading-relaxed">
            Rules are built from your approvals, rejections, and edits to keep your content on-brand.
            They are applied automatically to all future content created for your channels.
          </p>
        </div>
        <Button
          onClick={() => distill.mutate()}
          disabled={distill.isPending}
          className="border border-[#d0d7de] bg-white text-[#24292f] hover:bg-[#f6f8fa] shrink-0 font-medium"
          variant="outline"
        >
          {distill.isPending ? "Updating…" : "Update Brand Rules"}
        </Button>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={() => refetch()} title="Failed to load learnings" />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : learnings?.length === 0 ? (
        <div className="border border-[#d0d7de] bg-white px-5 py-12 text-center">
          <AlertCircle className="w-8 h-8 text-[#6e7781] mx-auto mb-3" />
          <p className="text-[14px] font-medium text-[#24292f]">No learnings distilled yet</p>
          <p className="text-[13px] text-[#57606a] mt-1">Reject some drafts with feedback, then distill learnings to generate rules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {learnings?.map((learning) => (
            <div
              key={learning.id}
              className="border border-[#d0d7de] bg-white p-4 flex flex-col"
            >
              <p className="text-[14px] text-[#24292f] leading-snug flex-1 mb-4">
                {learning.rule}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[#d0d7de]">
                <div>
                  <span className="text-[11px] font-semibold text-[#57606a]">Distilled </span>
                  <span className="text-[11px] text-[#6e7781]">
                    {formatDistanceToNow(new Date(learning.created_at), {addSuffix: true})}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove.mutate(learning.id)}
                  disabled={remove.isPending}
                  className="w-7 h-7 text-[#57606a] hover:text-[#cf222e] hover:bg-[#ffebe9]"
                  title="Deactivate Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
