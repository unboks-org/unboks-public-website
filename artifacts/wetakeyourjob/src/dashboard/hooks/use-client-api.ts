import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, DraftStatus } from "@dashboard/lib/api";
import { toast } from "sonner";
import { getErrorMessage } from "@dashboard/lib/error";
import { useAuthContext } from "@dashboard/components/auth/useAuthContext";

export function useAuth() {
  const { login: setAuthToken, isAuthenticated } = useAuthContext();

  const login = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      setAuthToken(data.token);
    },
  });

  return { login, isAuthenticated };
}

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: api.getStatus,
    refetchInterval: 30000,
  });
}

export function useDrafts(status?: DraftStatus, limit?: number) {
  return useQuery({
    queryKey: ["drafts", status, limit],
    queryFn: () => api.getDrafts(status, limit),
  });
}

export function useDraft(id: number) {
  return useQuery({
    queryKey: ["drafts", id],
    queryFn: () => api.getDraft(id),
    enabled: !!id,
  });
}

export function useDraftMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["drafts"] });
    queryClient.invalidateQueries({ queryKey: ["status"] });
  };

  const generate = useMutation({
    mutationFn: api.generateDrafts,
    onSuccess: (data) => {
      toast.success(`Generated ${data.count} new drafts`);
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to generate: ${getErrorMessage(err)}`),
  });

  const approve = useMutation({
    mutationFn: api.approveDraft,
    onSuccess: () => {
      toast.success("Draft approved");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to approve: ${getErrorMessage(err)}`),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => api.rejectDraft(id, reason),
    onSuccess: () => {
      toast.success("Draft rejected");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to reject: ${getErrorMessage(err)}`),
  });

  const publish = useMutation({
    mutationFn: api.publishDraft,
    onSuccess: () => {
      toast.success("Draft published successfully to Instagram!");
      // Brief 165/172: force-refetch all matching queries (active and inactive)
      // so the Social Media stats cards flip immediately post-publish.
      queryClient.invalidateQueries({ queryKey: ["drafts"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["status"], refetchType: "all" });
    },
    onError: (err: unknown) => toast.error(`Failed to publish: ${getErrorMessage(err)}`),
  });

  const generateGraphics = useMutation({
    mutationFn: api.generateGraphics,
    onSuccess: (data, id) => {
      // Write new image_path into cache immediately so the image div renders before the toast action fires
      queryClient.setQueryData<import("@dashboard/lib/api").Draft>(["drafts", id], (old) =>
        old ? { ...old, image_path: data.image_path } : old
      );
      invalidate();
      toast.success("New image generated — tap to view", {
        duration: 12000,
        action: {
          label: "View image ↑",
          onClick: () => {
            setTimeout(() => {
              document.getElementById("post-image-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
          },
        },
      });
    },
    onError: (err: unknown) => toast.error(`Failed to generate graphic: ${getErrorMessage(err)}`),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { instagram_caption?: string; facebook_caption?: string; hashtags?: string[]; visual_suggestion?: string; reasoning?: string; status?: string } }) =>
      api.updateDraft(id, data),
    onSuccess: (_, { id, data }) => {
      // Immediately reflect the saved values in cache
      queryClient.setQueryData<import("@dashboard/lib/api").Draft>(["drafts", id], (old) =>
        old ? { ...old, ...data, status: (data.status as import("@dashboard/lib/api").DraftStatus | undefined) ?? old.status } : old
      );
      toast.success("Edits saved — post back in review queue");
      // Invalidate list queries and status, but NOT ["drafts", id] —
      // that would trigger a server refetch that overwrites the values we just wrote.
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "drafts" && query.queryKey[1] !== id,
      });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
    onError: (err: unknown) => toast.error(`Failed to save edits: ${getErrorMessage(err)}`),
  });

  const remove = useMutation({
    mutationFn: api.deleteDraft,
    onSuccess: () => {
      toast.success("Draft deleted");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to delete: ${getErrorMessage(err)}`),
  });

  const compose = useMutation({
    mutationFn: ({ draftId, mode, photoId }: { draftId: number; mode: string; photoId?: number }) =>
      api.composeDraft(draftId, mode, photoId),
    onSuccess: (data) => {
      toast.success(data.ai_generated ? "AI image generated" : "Visual created");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Compose failed: ${getErrorMessage(err)}`),
  });

  const updatePlatforms = useMutation({
    mutationFn: ({ id, platforms }: { id: number; platforms: string[] }) =>
      api.updateDraftPlatforms(id, platforms),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData<import("@dashboard/lib/api").Draft>(["drafts", id], (old) =>
        old ? { ...old, platforms: data.platforms } : old
      );
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to update platforms: ${getErrorMessage(err)}`),
  });

  const schedule = useMutation({
    mutationFn: ({ id, scheduledAt }: { id: number; scheduledAt?: string }) =>
      api.scheduleDraft(id, scheduledAt),
    onSuccess: () => {
      toast.success("Draft scheduled");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to schedule: ${getErrorMessage(err)}`),
  });

  const unschedule = useMutation({
    mutationFn: api.unscheduleDraft,
    onSuccess: () => {
      toast.success("Draft unscheduled");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Failed to unschedule: ${getErrorMessage(err)}`),
  });

  return { generate, approve, reject, publish, generateGraphics, update, compose, remove, updatePlatforms, schedule, unschedule };
}

export function useAvailablePlatforms() {
  return useQuery({
    queryKey: ["platforms"],
    queryFn: api.getAvailablePlatforms,
  });
}

export function useEscalations() {
  return useQuery({
    queryKey: ["escalations"],
    queryFn: api.getEscalations,
    refetchInterval: 30000,
  });
}

export function useEscalationMutations() {
  const queryClient = useQueryClient();

  const resolve = useMutation({
    mutationFn: api.resolveEscalation,
    onSuccess: () => {
      toast.success("Escalation resolved");
      queryClient.invalidateQueries({ queryKey: ["escalations"] });
    },
    onError: (err: unknown) => toast.error(`Failed to resolve: ${getErrorMessage(err)}`),
  });

  return { resolve };
}

export function useEscalationReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answer }: { id: number; answer: string }) => api.replyToEscalation(id, answer),
    onSuccess: () => {
      toast.success("Reply sent to customer");
      queryClient.invalidateQueries({ queryKey: ["escalations"] });
    },
    onError: (err: unknown) => toast.error(`Reply failed: ${getErrorMessage(err)}`),
  });
}

export function useCreateManualDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createManualDraft,
    onSuccess: () => {
      toast.success("Post created");
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
    onError: (err: unknown) => toast.error(`Failed to create post: ${getErrorMessage(err)}`),
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: api.getConversations,
    refetchInterval: 30000, // auto-refresh every 30s
  });
}

export function useConversation(phone: string) {
  return useQuery({
    queryKey: ["conversation", phone],
    queryFn: () => api.getConversation(phone),
    enabled: !!phone,
  });
}

// Brief 166/172: hard-delete a conversation from the Messages page (SR's trash button).
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phone: string) => api.deleteConversation(phone),
    onSuccess: (data) => {
      toast.success(`Conversation deleted (${data.deleted_rows} rows)`);
      queryClient.invalidateQueries({ queryKey: ["conversations"], refetchType: "all" });
    },
    onError: (err: unknown) => toast.error(`Delete failed: ${getErrorMessage(err)}`),
  });
}

// Brief 167/172: resolve a customer file by identifier (conversation_id → real phone + display name).
export function useCustomerByIdentifier(type_: string | undefined, value: string | undefined) {
  return useQuery({
    queryKey: ["customer-by-identifier", type_, value],
    queryFn: () => api.getCustomerByIdentifier(type_!, value!),
    enabled: !!type_ && !!value,
  });
}

// Brief 172: hard-delete an escalation from the Escalations page (SR's trash button).
export function useDeleteEscalation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteEscalation(id),
    onSuccess: () => {
      toast.success("Escalation deleted");
      queryClient.invalidateQueries({ queryKey: ["escalations"], refetchType: "all" });
    },
    onError: (err: unknown) => toast.error(`Delete failed: ${getErrorMessage(err)}`),
  });
}

export function useSuggestReply() {
  return useMutation({
    mutationFn: (data: { phone: string; draft_text?: string }) => api.suggestReply(data),
    onError: (err: unknown) => toast.error(`Failed: ${getErrorMessage(err)}`),
  });
}

export function useScheduleSlots() {
  return useQuery({
    queryKey: ["schedule-slots"],
    queryFn: api.getScheduleSlots,
  });
}

export function useUpcomingSchedule() {
  return useQuery({
    queryKey: ["schedule-upcoming"],
    queryFn: api.getUpcomingSchedule,
  });
}

export function useScheduleSlotMutations() {
  const queryClient = useQueryClient();

  const updateSlots = useMutation({
    mutationFn: api.updateScheduleSlots,
    onSuccess: () => {
      toast.success("Schedule updated");
      queryClient.invalidateQueries({ queryKey: ["schedule-slots"] });
      queryClient.invalidateQueries({ queryKey: ["schedule-upcoming"] });
    },
    onError: (err: unknown) => toast.error(`Failed to update schedule: ${getErrorMessage(err)}`),
  });

  return { updateSlots };
}

export function useTrainingExamples() {
  return useQuery({
    queryKey: ["training-examples"],
    queryFn: api.getTrainingExamples,
  });
}

export function useTrainingMutations() {
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: ({ captionText, platform, file }: { captionText: string; platform: string; file?: File }) =>
      api.uploadTrainingExample(captionText, platform, file),
    onSuccess: () => {
      toast.success("Training example uploaded");
      queryClient.invalidateQueries({ queryKey: ["training-examples"] });
    },
    onError: (err: unknown) => toast.error(`Upload failed: ${getErrorMessage(err)}`),
  });

  const remove = useMutation({
    mutationFn: api.deleteTrainingExample,
    onSuccess: () => {
      toast.success("Training example removed");
      queryClient.invalidateQueries({ queryKey: ["training-examples"] });
    },
    onError: (err: unknown) => toast.error(`Delete failed: ${getErrorMessage(err)}`),
  });

  const analyze = useMutation({
    mutationFn: api.analyzeTraining,
    onSuccess: (data) => {
      toast.success(`Extracted brand rules from ${data.categories_analyzed} categories`);
      queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
      queryClient.invalidateQueries({ queryKey: ["training-examples"] });
    },
    onError: (err: unknown) => toast.error(`Analysis failed: ${getErrorMessage(err)}`),
  });

  return { upload, remove, analyze };
}

export function useLearnings() {
  return useQuery({
    queryKey: ["learnings"],
    queryFn: api.getLearnings,
  });
}

export function useLearningMutations() {
  const queryClient = useQueryClient();

  const distill = useMutation({
    mutationFn: api.distillLearnings,
    onSuccess: (data) => {
      toast.success(`Distilled ${data.count} new brand learnings`);
      queryClient.invalidateQueries({ queryKey: ["learnings"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
    onError: (err: unknown) => toast.error(`Failed to distill learnings: ${getErrorMessage(err)}`),
  });

  const remove = useMutation({
    mutationFn: api.deleteLearning,
    onSuccess: () => {
      toast.success("Learning rule deactivated");
      queryClient.invalidateQueries({ queryKey: ["learnings"] });
    },
    onError: (err: unknown) => toast.error(`Failed to deactivate learning: ${getErrorMessage(err)}`),
  });

  return { distill, remove };
}

export function useAvailability(days: number) {
  return useQuery({
    queryKey: ["availability", days],
    queryFn: () => api.getAvailability(days),
  });
}

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: api.getConfig,
  });
}

export function usePhotos(serviceKey?: string) {
  return useQuery({
    queryKey: ["photos", serviceKey],
    queryFn: () => api.getPhotos(serviceKey),
  });
}

export function usePhotoStats() {
  return useQuery({
    queryKey: ["photo-stats"],
    queryFn: api.getPhotoStats,
  });
}

export function usePhotoMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["photos"] });
    queryClient.invalidateQueries({ queryKey: ["photo-stats"] });
  };

  const upload = useMutation({
    mutationFn: ({ file, tags, serviceKey }: { file: File; tags: string; serviceKey: string }) =>
      api.uploadPhoto(file, tags, serviceKey),
    onSuccess: () => {
      toast.success("Photo uploaded");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Upload failed: ${getErrorMessage(err)}`),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { tags?: string[]; service_key?: string } }) =>
      api.updatePhoto(id, data),
    onSuccess: () => {
      toast.success("Photo updated");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Update failed: ${getErrorMessage(err)}`),
  });

  const remove = useMutation({
    mutationFn: api.deletePhoto,
    onSuccess: () => {
      toast.success("Photo deleted");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Delete failed: ${getErrorMessage(err)}`),
  });

  return { upload, update, remove };
}

export function useGoogleDriveStatus() {
  return useQuery({
    queryKey: ["google-drive-status"],
    queryFn: api.getGoogleStatus,
  });
}

export function useGoogleDriveFolders(enabled: boolean) {
  return useQuery({
    queryKey: ["google-drive-folders"],
    queryFn: api.getGoogleFolders,
    enabled,
  });
}

export function useGoogleDriveMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["google-drive-status"] });
    queryClient.invalidateQueries({ queryKey: ["photos"] });
    queryClient.invalidateQueries({ queryKey: ["photo-stats"] });
  };

  const disconnect = useMutation({
    mutationFn: api.disconnectGoogle,
    onSuccess: () => {
      toast.success("Google Drive disconnected");
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Disconnect failed: ${getErrorMessage(err)}`),
  });

  const setFolder = useMutation({
    mutationFn: api.setGoogleFolder,
    onSuccess: () => {
      toast.success("Drive folder selected");
      queryClient.invalidateQueries({ queryKey: ["google-drive-status"] });
    },
    onError: (err: unknown) => toast.error(`Failed to set folder: ${getErrorMessage(err)}`),
  });

  const sync = useMutation({
    mutationFn: api.syncGoogleDrive,
    onSuccess: (data) => {
      toast.success(`Synced ${data.synced} new photo${data.synced !== 1 ? "s" : ""} from Drive`);
      invalidate();
    },
    onError: (err: unknown) => toast.error(`Sync failed: ${getErrorMessage(err)}`),
  });

  return { disconnect, setFolder, sync };
}

export function useDryRun() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["dry-run"],
    queryFn: api.getDryRun,
  });
  const toggle = useMutation({
    mutationFn: api.toggleDryRun,
    onSuccess: (data) => {
      queryClient.setQueryData(["dry-run"], data);
      toast.success(data.dry_run ? "Dry-run mode ON — publishing disabled" : "Dry-run mode OFF — publishing is live");
    },
    onError: (err: unknown) => toast.error(`Toggle failed: ${getErrorMessage(err)}`),
  });
  return { data: query.data, isLoading: query.isLoading, toggle };
}

export function useBrandProfile() {
  return useQuery({
    queryKey: ["brand-profile"],
    queryFn: api.getBrandProfile,
  });
}

export function useAnalyzeVisual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.analyzeVisualStyle,
    onSuccess: (data) => {
      toast.success(`Extracted ${data.count} visual style rules from your photos`);
      queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
      queryClient.invalidateQueries({ queryKey: ["learnings"] });
    },
    onError: (err: unknown) => toast.error(`Visual analysis failed: ${getErrorMessage(err)}`),
  });
}

export function useBrandProfileMutations() {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: api.deleteBrandRule,
    onSuccess: () => {
      toast.success("Rule removed");
      queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
    },
    onError: (err: unknown) => toast.error(`Failed to remove rule: ${getErrorMessage(err)}`),
  });

  const addRule = useMutation({
    mutationFn: ({ category, rule }: { category: string; rule: string }) =>
      api.addBrandRule(category, rule),
    onSuccess: () => {
      toast.success("Rule added");
      queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
    },
    onError: (err: unknown) => toast.error(`Failed to add rule: ${getErrorMessage(err)}`),
  });

  const update = useMutation({
    mutationFn: ({ id, rule }: { id: number; rule: string }) => api.updateBrandRule(id, rule),
    onSuccess: () => {
      toast.success("Rule updated");
      queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
    },
    onError: (err: unknown) => toast.error(`Failed to update rule: ${getErrorMessage(err)}`),
  });

  return { remove, addRule, update };
}
