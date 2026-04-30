import { useState, useRef, useMemo } from "react";
import { usePhotos, usePhotoStats, usePhotoMutations, useGoogleDriveStatus, useGoogleDriveFolders, useGoogleDriveMutations } from "@dashboard/hooks/use-client-api";
import { Photo } from "@dashboard/lib/api";
import { api } from "@dashboard/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { Badge } from "@dashboard/components/ui/badge";
import { Input } from "@dashboard/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@dashboard/components/ui/dialog";
import {
  Upload, Trash2, Image as ImageIcon, FolderOpen, Tag,
  X, Plus, RefreshCw, HardDrive, CheckCircle2, ArrowLeft,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";

// ─── Photo Thumbnail ────────────────────────────────────────────────────────

function PhotoThumb({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const { data: blob } = useQuery({
    queryKey: ["photo-image", photo.id],
    queryFn: () => api.getPhotoImageBlob(photo.id),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const url = useMemo(() => {
    if (!blob || blob.size === 0) return null;
    return URL.createObjectURL(blob);
  }, [blob]);

  return (
    <div
      onClick={onClick}
      className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-card cursor-pointer hover:border-primary/40 transition-colors"
    >
      {url ? (
        <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/50">
          <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-[#24292f]/80 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-white truncate">{photo.original_filename}</p>
        {photo.service_key && (
          <p className="text-[10px] text-white/60">{photo.service_key}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AssetLibrary() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [tripFilter, setTripFilter] = useState<string>("");
  const { data: photos, isLoading, error, refetch } = usePhotos(tripFilter || undefined);
  const { data: stats } = usePhotoStats();
  const { upload, remove } = usePhotoMutations();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Photo | null>(null);

  // Google Drive
  const { data: driveStatus } = useGoogleDriveStatus();
  const { data: driveFolders } = useGoogleDriveFolders(driveStatus?.connected === true && !driveStatus?.folder_id);
  const { disconnect: driveDisconnect, setFolder: driveSetFolder, sync: driveSync } = useGoogleDriveMutations();
  const [folderPickerOpen, setFolderPickerOpen] = useState(false);

  // Upload form state
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadTags, setUploadTags] = useState("");
  const [uploadServiceKey, setUploadServiceKey] = useState("");

  const serviceKeys = useMemo(() => {
    if (!stats?.by_trip) return [];
    return Object.keys(stats.by_trip).filter(k => k !== "untagged").sort();
  }, [stats]);

  const handleUpload = async () => {
    for (const file of uploadFiles) {
      await upload.mutateAsync({ file, tags: uploadTags, serviceKey: uploadServiceKey });
    }
    setUploadOpen(false);
    setUploadFiles([]);
    setUploadTags("");
    setUploadServiceKey("");
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    remove.mutate(deleteConfirm.id);
    setDeleteConfirm(null);
    setSelectedPhoto(null);
  };

  return (
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Asset Library</h1>
          <p className="text-muted-foreground">
            Upload and manage photos for social media posts.
            {stats ? ` ${stats.total} photo${stats.total !== 1 ? "s" : ""} in library.` : ""}
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      {/* Google Drive connection */}
      {driveStatus && !driveStatus.connected && (
        <div className="flex items-center justify-between rounded-xl border-l-4 border-l-blue-500 border-t border-r border-b border-border/70 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-foreground">Connect Google Drive</p>
              <p className="text-xs text-muted-foreground">Sync photos automatically from a Drive folder</p>
            </div>
          </div>
          <a href={api.getGoogleAuthUrl(window.location.href)}>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Connect
            </Button>
          </a>
        </div>
      )}

      {driveStatus?.connected && !driveStatus.folder_id && (
        <div className="flex items-center justify-between rounded-xl border-l-4 border-l-teal-500 border-t border-r border-b border-border/70 bg-teal-50/60 dark:bg-teal-950/20 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <div>
              <p className="text-sm font-medium text-foreground">Google Drive connected</p>
              <p className="text-xs text-muted-foreground">Select a folder to sync photos from</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setFolderPickerOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Choose Folder
          </Button>
        </div>
      )}

      {driveStatus?.connected && driveStatus.folder_id && (
        <div className="flex items-center justify-between rounded-xl border-l-4 border-l-emerald-500 border-t border-r border-b border-border/70 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <div>
              <p className="text-sm text-foreground">Google Drive synced</p>
              <p className="text-[10px] text-muted-foreground/50">Shared across all sessions</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => driveSync.mutate()}
            disabled={driveSync.isPending}
            className="border-border"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-2", driveSync.isPending && "animate-spin")} />
            {driveSync.isPending ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      )}

      {/* Trip filter */}
      {serviceKeys.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Filter:</span>
          <button
            onClick={() => setTripFilter("")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              !tripFilter ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All ({stats?.total ?? 0})
          </button>
          {serviceKeys.map(key => (
            <button
              key={key}
              onClick={() => setTripFilter(key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                tripFilter === key ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {key.replace(/_/g, " ")} ({stats?.by_trip[key] ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* Photo grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} title="Could not load photos" />
      ) : !photos?.length ? (
        <div className="flex flex-col items-center justify-center py-20 border border-[#d0d7de] bg-white">
          <FolderOpen className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-xl font-medium text-foreground/80">No photos yet</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-center">
            Upload photos of your experiences, boats, destinations — our system will use them in your social media posts.
          </p>
          <Button
            onClick={() => setUploadOpen(true)}
            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload your first photos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map(photo => (
            <PhotoThumb key={photo.id} photo={photo} onClick={() => setSelectedPhoto(photo)} />
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Upload Photos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
              />
              <Button
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="w-full border-dashed border-2 border-border h-24 hover:bg-muted/50"
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploadFiles.length ? `${uploadFiles.length} file${uploadFiles.length > 1 ? "s" : ""} selected` : "Choose files"}
                  </span>
                </div>
              </Button>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Trip</label>
              <Input
                value={uploadServiceKey}
                onChange={(e) => setUploadServiceKey(e.target.value)}
                placeholder="e.g. klein_curacao, sunset_cruise"
                className="bg-muted/50 border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Tags</label>
              <Input
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
                placeholder="sunset, boat, snorkeling (comma-separated)"
                className="bg-muted/50 border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadOpen(false)} className="text-foreground/70">Cancel</Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFiles.length || upload.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              {upload.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo detail dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-lg">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedPhoto.original_filename}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border bg-black/40 aspect-video">
                  <PhotoThumbLarge photoId={selectedPhoto.id} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Trip:</span>{" "}
                    <span className="text-foreground">{selectedPhoto.service_key || "Untagged"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    <span className="text-foreground">{selectedPhoto.width}x{selectedPhoto.height}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>{" "}
                    <span className="text-foreground">{selectedPhoto.source}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Used:</span>{" "}
                    <span className="text-foreground">{selectedPhoto.used_count} times</span>
                  </div>
                </div>
                {selectedPhoto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPhoto.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Tag className="w-3 h-3 mr-1" />{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setDeleteConfirm(selectedPhoto)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteConfirm?.original_filename}</strong>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button onClick={handleDelete} disabled={remove.isPending} className="bg-red-500 text-white hover:bg-red-600">
              {remove.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Folder picker dialog */}
      <Dialog open={folderPickerOpen} onOpenChange={setFolderPickerOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Drive Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2 max-h-64 overflow-y-auto">
            {driveFolders?.length ? driveFolders.map(f => (
              <button
                key={f.id}
                onClick={() => {
                  driveSetFolder.mutate(f.id);
                  setFolderPickerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-muted transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{f.name}</span>
              </button>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No folders found in Drive root.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple large image component
function PhotoThumbLarge({ photoId }: { photoId: number }) {
  const { data: blob } = useQuery({
    queryKey: ["photo-image", photoId],
    queryFn: () => api.getPhotoImageBlob(photoId),
    staleTime: 10 * 60 * 1000,
  });
  const url = useMemo(() => blob && blob.size > 0 ? URL.createObjectURL(blob) : null, [blob]);
  if (!url) return <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground/30" /></div>;
  return <img src={url} className="w-full h-full object-contain" />;
}
