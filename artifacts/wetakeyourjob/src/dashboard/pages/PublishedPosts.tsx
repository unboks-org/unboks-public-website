import { useDrafts, useDraftMutations } from "@dashboard/hooks/use-client-api";
import { AuthImage } from "@dashboard/components/ui/auth-image";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@dashboard/components/ui/dialog";
import { format } from "date-fns";
import { ExternalLink, Trash2, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useState } from "react";
import { Draft } from "@dashboard/lib/api";

export default function PublishedPosts() {
  const navigate = useNavigate();
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
    <div className="space-y-8">
      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Published Gallery</h1>
        <p className="text-muted-foreground">Archive of all content pushed live to social channels.</p>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={() => refetch()} title="Failed to load published posts" />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[4/5] rounded-2xl glass-card" />)}
        </div>
      ) : posts?.length === 0 ? (
        <div className="glass-card p-16 text-center rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-2xl font-display font-medium text-foreground">No published posts yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Posts that are approved and published from the pipeline will populate this gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts?.map(post => (
            <div key={post.id} className="glass-card rounded-2xl overflow-hidden border-white/5 group hover:border-primary/30 transition-all shadow-xl">
              <div className="aspect-square relative bg-black/40">
                <AuthImage draftId={post.id} className="opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300"
                      onClick={() => setDeleteConfirm(post)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-4 text-foreground font-medium translate-y-[10px] group-hover:translate-y-0 transition-all duration-300">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" /> --</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 fill-white" /> --</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-primary font-medium mb-3">
                  {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : 'Unknown date'}
                </p>
                <p className="text-sm text-foreground/80 line-clamp-3 mb-4 leading-relaxed">
                  {post.instagram_caption}
                </p>
                {post.instagram_url ? (
                  <a href={post.instagram_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground/90 font-medium text-sm transition-colors border border-border">
                    View on Instagram <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                ) : (
                  <Button variant="outline" className="w-full border-border text-muted-foreground/60" disabled>
                    Link Unavailable
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-rose-400">Delete Published Record</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This only removes the record from the dashboard. It will NOT delete the actual post on Instagram/Facebook. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-foreground/70 hover:bg-muted">Cancel</Button>
            <Button onClick={handleDelete} disabled={remove.isPending} className="bg-rose-500 text-foreground hover:bg-rose-600">
              {remove.isPending ? "Deleting..." : "Delete Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
