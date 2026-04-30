import { useDrafts, useDraftMutations } from "@dashboard/hooks/use-client-api";
import { AuthImage } from "@dashboard/components/ui/auth-image";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@dashboard/components/ui/dialog";
import { format } from "date-fns";
import { ExternalLink, Trash2, ArrowLeft } from "lucide-react";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useState } from "react";
import { Draft } from "@dashboard/lib/api";

export default function PublishedPosts() {
  const goBack = useGoBack();
  const { data: posts, isLoading, error, refetch } = useDrafts("published");
  const { remove } = useDraftMutations();
  const [deleteConfirm, setDeleteConfirm] = useState<Draft | null>(null);

  const handleDelete = () => {
    if (deleteConfirm) {
      remove.mutate(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1.5 text-[13px] text-[#57606a] hover:text-[#24292f] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div>
        <h1 className="text-[18px] font-semibold text-[#24292f] mb-1">Published Gallery</h1>
        <p className="text-[13px] text-[#57606a]">Archive of all content pushed live to social channels.</p>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={() => refetch()} title="Failed to load published posts" />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[4/5]" />)}
        </div>
      ) : posts?.length === 0 ? (
        <div className="border border-[#d0d7de] bg-white px-5 py-12 text-center">
          <p className="text-[14px] font-medium text-[#24292f]">No published posts yet</p>
          <p className="text-[13px] text-[#57606a] mt-1">Posts that are approved and published from the pipeline will populate this gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts?.map(post => (
            <div key={post.id} className="border border-[#d0d7de] bg-white overflow-hidden">
              <div className="aspect-square relative bg-[#f6f8fa]">
                <AuthImage draftId={post.id} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-[11px] text-[#57606a] tabular-nums">
                  {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Unknown date'}
                </p>
                <p className="text-[13px] text-[#24292f] line-clamp-2 leading-snug">
                  {post.instagram_caption}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {post.instagram_url ? (
                    <a
                      href={post.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[12px] text-[#0969da] hover:underline"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[12px] text-[#6e7781]">No link</span>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(post)}
                    className="ml-auto p-1.5 rounded-md text-[#57606a] hover:text-[#cf222e] hover:bg-[#ffebe9] transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="bg-white border-[#d0d7de] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold text-[#24292f]">Delete Published Record</DialogTitle>
            <DialogDescription className="text-[13px] text-[#57606a]">
              This only removes the record from the dashboard. It will NOT delete the actual post on Instagram/Facebook. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-[#57606a]">Cancel</Button>
            <Button
              onClick={handleDelete}
              disabled={remove.isPending}
              className="bg-[#cf222e] text-white hover:bg-[#a40e26] border-0"
            >
              {remove.isPending ? "Deleting..." : "Delete Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
