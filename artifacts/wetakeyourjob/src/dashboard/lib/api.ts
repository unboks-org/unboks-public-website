// Brief 177 — multi-client dashboard routing. Path-prefix dispatches to
// one of three backend containers via nginx on the VPS. The selected
// client is persisted in localStorage so it survives reloads.
export const VALID_CLIENTS = ["bluemarlin", "adamus", "consultadespertares", "unboks"] as const;
export type Client = typeof VALID_CLIENTS[number];

const CLIENT_STORAGE_KEY = "wtyj_client";

export function getClient(): Client {
  const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
  return VALID_CLIENTS.includes(stored as Client) ? (stored as Client) : "bluemarlin";
}

export function setClient(client: Client): void {
  localStorage.setItem(CLIENT_STORAGE_KEY, client);
  BASE_URL = `https://api.wetakeyourjob.com/${client}/dashboard/api`;
}

// `let` (not `const`) so setClient() can re-point it without touching
// the 59 existing `${BASE_URL}/path` call sites below.
let BASE_URL = `https://api.wetakeyourjob.com/${getClient()}/dashboard/api`;

export type DraftStatus = "pending" | "approved" | "rejected" | "published" | "deleted" | "scheduled";
export type ContentClass = "A" | "B" | "C" | "D";

export interface StatusResponse {
  pending: number;
  approved: number;
  rejected: number;
  published: number;
  deleted: number;
  learnings: number;
  season: string;
}

export interface Draft {
  id: number;
  content_class: ContentClass;
  instagram_caption: string;
  facebook_caption: string;
  twitter_caption: string;
  hashtags: string[];
  visual_suggestion: string;
  reasoning: string;
  status: DraftStatus;
  rejection_reason?: string;
  created_at: string;
  approved_at?: string;
  published_at?: string;
  image_path?: string;
  late_post_id?: string;
  instagram_url?: string;
  platforms?: string[];
  facebook_url?: string;
  scheduled_at?: string;
}

export interface Learning {
  id: number;
  rule: string;
  source_draft_ids: number[];
  created_at: string;
}

export interface AvailabilitySlot {
  service_key: string;
  date: string;
  slot_time: string;
  booked_guests: number;
  capacity: number;
  spots_remaining: number;
}

export interface ConfigResponse {
  context: string;
}

export interface ScheduleSlot {
  id: number;
  day_of_week: string;
  time_utc: string;
}

export interface TrainingExample {
  id: number;
  caption_text: string;
  image_path: string;
  platform: string;
  created_at: string;
}

export interface Conversation {
  phone: string;
  customer_name: string;
  last_message: string;
  last_message_role: string;
  last_message_at: string;
  status: string;
  message_count: number;
  channel?: string;  // Brief 171/172: 'whatsapp' | 'email' | 'instagram_dm' | 'facebook_dm' | 'twitter_dm'
}

export interface CustomerFile {
  id: number;
  display_name: string;
  summary: string;
  notes: string;
  first_seen: string;
  last_seen: string;
  identifiers: { type: string; value: string; first_seen: string }[];
  recent_interactions: { channel: string; summary: string; created_at: string }[];
}

export interface ConversationDetail {
  phone: string;
  messages: { role: string; text: string; created_at: string }[];
  booking_state: {
    fields: Record<string, unknown>;
    flags: Record<string, unknown>;
    completed_bookings: unknown[];
    last_activity: string | null;
  };
}

export interface Escalation {
  id: number;
  notification_type: string;
  relay_token: string | null;
  channel: string;
  customer_id: string;
  customer_name: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
  // Brief 181/183: contact enrichment
  contact_type?: "email" | "whatsapp" | "phone" | "unknown";
  customer_contact?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
}

export interface Photo {
  id: number;
  filename: string;
  original_filename: string;
  tags: string[];
  service_key: string;
  source: string;
  width: number;
  height: number;
  file_size: number;
  used_count: number;
  uploaded_at: string;
}

export interface PhotoStats {
  total: number;
  by_trip: Record<string, number>;
}

// Brief 177 — token storage key is namespaced by client so switching
// clients doesn't bleed one client's session into another's. Each
// client gets its own localStorage slot. Must match AuthProvider.tsx.
function getTokenKey(): string {
  return `wtyj_token_${getClient()}`;
}

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

function getToken(): string | null {
  return localStorage.getItem(getTokenKey());
}

function getHeaders(isFormData = false) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

// Two-strike 401 guard — one transient 401 is ignored; only log out on a
// second confirmed 401 within a 60-second window, or if the token is absent.
let _401count = 0;
let _401lastMs = 0;
const _401WINDOW_MS = 60_000;

function handle401(): never {
  const now = Date.now();
  if (now - _401lastMs > _401WINDOW_MS) {
    _401count = 0;
  }
  _401count += 1;
  _401lastMs = now;

  if (_401count >= 2 || !localStorage.getItem(getTokenKey())) {
    _401count = 0;
    localStorage.removeItem(getTokenKey());
    if (onUnauthorized) onUnauthorized();
  }
  throw new Error("Unauthorized");
}

function markSuccess() {
  _401count = 0;
}

function handleUnauthorized(): never {
  return handle401();
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    handle401();
  }
  markSuccess();
  if (!res.ok) {
    const raw = await res.text().catch(() => "");

    let extracted = "";
    try {
      const json = JSON.parse(raw);
      extracted = json.error || json.message || json.detail || "";
    } catch {
      extracted = raw;
    }

    const lower = extracted.toLowerCase();
    if (lower.includes("foreign key constraint") || lower.includes("violates")) {
      throw new Error(
        "This record cannot be deleted — it is referenced by other data. Please contact technical support if you need it removed."
      );
    }
    if (lower.includes("duplicate key") || lower.includes("unique constraint")) {
      throw new Error("A record with this information already exists.");
    }
    if (res.status === 500) {
      throw new Error(
        extracted
          ? `Server error: ${extracted}`
          : "The server encountered an error. Please try again or contact support."
      );
    }

    throw new Error(extracted || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  login: async (password: string): Promise<{ token: string }> => {
    const url = `${BASE_URL}/login`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      console.error("[api.login] fetch failed", { name: e.name, message: e.message, url });
      throw e;
    }
    if (!res.ok) throw new Error("Invalid password");
    return res.json();
  },

  getStatus: async (): Promise<StatusResponse> => {
    const res = await fetch(`${BASE_URL}/status`, { headers: getHeaders() });
    return handleResponse<StatusResponse>(res);
  },

  getDrafts: async (status?: DraftStatus, limit?: number): Promise<Draft[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (limit) params.append("limit", limit.toString());
    const res = await fetch(`${BASE_URL}/drafts?${params.toString()}`, { headers: getHeaders() });
    return handleResponse<Draft[]>(res);
  },

  getDraft: async (id: number): Promise<Draft> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}`, { headers: getHeaders() });
    return handleResponse<Draft>(res);
  },

  generateDrafts: async (count: number): Promise<{ drafts: Draft[]; count: number }> => {
    const res = await fetch(`${BASE_URL}/drafts/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ count }),
    });
    return handleResponse(res);
  },

  approveDraft: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/approve`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  rejectDraft: async (id: number, reason: string): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/reject`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },

  publishDraft: async (id: number): Promise<{ ok: boolean; post_url: string }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/publish`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  generateGraphics: async (id: number): Promise<{ ok: boolean; image_path: string }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/graphics`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateDraft: async (id: number, data: { instagram_caption?: string; facebook_caption?: string; hashtags?: string[]; visual_suggestion?: string; reasoning?: string; status?: string }): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteDraft: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getDraftImageBlob: async (id: number): Promise<Blob> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/image`, { headers: getHeaders() });
    if (res.status === 401) handleUnauthorized();
    if (!res.ok) throw new Error("Failed to load image");
    return res.blob();
  },

  getLearnings: async (): Promise<Learning[]> => {
    const res = await fetch(`${BASE_URL}/learnings`, { headers: getHeaders() });
    return handleResponse<Learning[]>(res);
  },

  distillLearnings: async (): Promise<{ learnings: Learning[]; count: number }> => {
    const res = await fetch(`${BASE_URL}/learnings/distill`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteLearning: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/learnings/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAvailability: async (days: number): Promise<AvailabilitySlot[]> => {
    const res = await fetch(`${BASE_URL}/availability?days=${days}`, { headers: getHeaders() });
    return handleResponse<AvailabilitySlot[]>(res);
  },

  getConfig: async (): Promise<ConfigResponse> => {
    const res = await fetch(`${BASE_URL}/config`, { headers: getHeaders() });
    return handleResponse<ConfigResponse>(res);
  },

  // --- Photos ---

  uploadPhoto: async (file: File, tags: string, serviceKey: string): Promise<{ ok: boolean; photo: Photo }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);
    formData.append("service_key", serviceKey);
    const res = await fetch(`${BASE_URL}/photos/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    return handleResponse(res);
  },

  getPhotos: async (serviceKey?: string, limit?: number): Promise<Photo[]> => {
    const params = new URLSearchParams();
    if (serviceKey) params.append("service_key", serviceKey);
    if (limit) params.append("limit", limit.toString());
    const res = await fetch(`${BASE_URL}/photos?${params.toString()}`, { headers: getHeaders() });
    return handleResponse<Photo[]>(res);
  },

  getPhotoImageBlob: async (id: number): Promise<Blob> => {
    const res = await fetch(`${BASE_URL}/photos/${id}/image`, { headers: getHeaders() });
    if (res.status === 401) handleUnauthorized();
    if (!res.ok) throw new Error("Failed to load photo");
    return res.blob();
  },

  getPhotoStats: async (): Promise<PhotoStats> => {
    const res = await fetch(`${BASE_URL}/photos/stats`, { headers: getHeaders() });
    return handleResponse<PhotoStats>(res);
  },

  updatePhoto: async (id: number, data: { tags?: string[]; service_key?: string }): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/photos/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  composeDraft: async (draftId: number, mode: string, photoId?: number): Promise<{ ok: boolean; image_path: string; ai_generated: boolean }> => {
    const body: Record<string, unknown> = { mode };
    if (photoId) body.photo_id = photoId;
    const res = await fetch(`${BASE_URL}/drafts/${draftId}/compose`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  deletePhoto: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/photos/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Google Drive ---

  getGoogleAuthUrl: (redirectTo: string): string => {
    return `${BASE_URL}/google/auth?redirect_to=${encodeURIComponent(redirectTo)}`;
  },

  getGoogleStatus: async (): Promise<{ connected: boolean; folder_id?: string; updated_at?: string }> => {
    const res = await fetch(`${BASE_URL}/google/status`, { headers: getHeaders() });
    return handleResponse(res);
  },

  disconnectGoogle: async (): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/google/disconnect`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getGoogleFolders: async (): Promise<{ id: string; name: string }[]> => {
    const res = await fetch(`${BASE_URL}/google/folders`, { headers: getHeaders() });
    return handleResponse(res);
  },

  setGoogleFolder: async (folderId: string): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/google/folder`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ folder_id: folderId }),
    });
    return handleResponse(res);
  },

  syncGoogleDrive: async (): Promise<{ ok: boolean; synced: number; total_in_folder: number }> => {
    const res = await fetch(`${BASE_URL}/google/sync`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Settings ---

  getDryRun: async (): Promise<{ dry_run: boolean }> => {
    const res = await fetch(`${BASE_URL}/settings/dry-run`, { headers: getHeaders() });
    return handleResponse(res);
  },

  toggleDryRun: async (): Promise<{ dry_run: boolean }> => {
    const res = await fetch(`${BASE_URL}/settings/dry-run`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Training ---

  uploadTrainingExample: async (captionText: string, platform: string, file?: File): Promise<{ ok: boolean; id: number }> => {
    const formData = new FormData();
    formData.append("caption_text", captionText);
    formData.append("platform", platform);
    if (file) formData.append("file", file);
    const res = await fetch(`${BASE_URL}/training/examples`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    return handleResponse(res);
  },

  getTrainingExamples: async (): Promise<TrainingExample[]> => {
    const res = await fetch(`${BASE_URL}/training/examples`, { headers: getHeaders() });
    return handleResponse<TrainingExample[]>(res);
  },

  deleteTrainingExample: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/training/examples/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getTrainingExampleImageBlob: async (id: number): Promise<Blob> => {
    const res = await fetch(`${BASE_URL}/training/examples/${id}/image`, { headers: getHeaders() });
    if (res.status === 401) handleUnauthorized();
    if (!res.ok) throw new Error("Failed to load image");
    return res.blob();
  },

  analyzeTraining: async (): Promise<{ ok: boolean; categories_analyzed: number }> => {
    const res = await fetch(`${BASE_URL}/training/analyze`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  addBrandRule: async (category: string, rule: string): Promise<{ ok: boolean; id: number }> => {
    const res = await fetch(`${BASE_URL}/training/profile`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ category, rule }),
    });
    return handleResponse(res);
  },

  analyzeVisualStyle: async (): Promise<{ ok: boolean; visual_rules: string[]; count: number }> => {
    const res = await fetch(`${BASE_URL}/training/analyze-visual`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getBrandProfile: async (): Promise<Record<string, { id: number; category: string; rule: string; source: string; created_at: string }[]>> => {
    const res = await fetch(`${BASE_URL}/training/profile`, { headers: getHeaders() });
    return handleResponse(res);
  },

  deleteBrandRule: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/training/profile/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateBrandRule: async (id: number, rule: string): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/training/profile/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ rule }),
    });
    return handleResponse(res);
  },

  // --- Messages ---

  getConversations: async (): Promise<Conversation[]> => {
    const res = await fetch(`${BASE_URL}/messages/conversations`, { headers: getHeaders() });
    return handleResponse<Conversation[]>(res);
  },

  getConversation: async (phone: string): Promise<ConversationDetail> => {
    const res = await fetch(`${BASE_URL}/messages/conversations/${encodeURIComponent(phone)}`, { headers: getHeaders() });
    return handleResponse<ConversationDetail>(res);
  },

  // Brief 165/172: hard-delete a conversation (messages + booking state rows).
  deleteConversation: async (phone: string): Promise<{ ok: boolean; deleted_rows: number; phone: string }> => {
    const res = await fetch(`${BASE_URL}/messages/conversations/${encodeURIComponent(phone)}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Brief 167/172: resolve a customer file by identifier for PHONE field display.
  getCustomerByIdentifier: async (type_: string, value: string): Promise<CustomerFile | null> => {
    const res = await fetch(`${BASE_URL}/customers/by-identifier/${encodeURIComponent(type_)}/${encodeURIComponent(value)}`, {
      headers: getHeaders(),
    });
    return handleResponse<CustomerFile | null>(res);
  },

  suggestReply: async (data: { phone: string; draft_text?: string }): Promise<{ subject: string; body: string }> => {
    const res = await fetch(`${BASE_URL}/messages/suggest-reply`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // --- Escalations ---

  getEscalations: async (): Promise<Escalation[]> => {
    const res = await fetch(`${BASE_URL}/escalations`, { headers: getHeaders() });
    return handleResponse<Escalation[]>(res);
  },

  resolveEscalation: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/escalations/${id}/resolve`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Brief 172: hard-delete an escalation (trash button in SR's archive view).
  deleteEscalation: async (id: number): Promise<{ ok: boolean; id: number }> => {
    const res = await fetch(`${BASE_URL}/escalations/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  replyToEscalation: async (id: number, answer: string): Promise<{ ok: boolean; reply: string }> => {
    const res = await fetch(`${BASE_URL}/escalations/${id}/reply`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ answer }),
    });
    return handleResponse(res);
  },

  // --- Manual Drafts ---

  createManualDraft: async (data: {
    instagram_caption: string;
    facebook_caption?: string;
    hashtags?: string[];
    content_class?: string;
    visual_suggestion?: string;
    platforms?: string[];
  }): Promise<{ ok: boolean; id: number }> => {
    const res = await fetch(`${BASE_URL}/drafts/manual`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // --- Schedule ---

  getScheduleSlots: async (): Promise<ScheduleSlot[]> => {
    const res = await fetch(`${BASE_URL}/schedule/slots`, { headers: getHeaders() });
    return handleResponse<ScheduleSlot[]>(res);
  },

  updateScheduleSlots: async (slots: { day_of_week: string; time_utc: string }[]): Promise<{ ok: boolean; slots: ScheduleSlot[] }> => {
    const res = await fetch(`${BASE_URL}/schedule/slots`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ slots }),
    });
    return handleResponse(res);
  },

  getUpcomingSchedule: async (): Promise<Draft[]> => {
    const res = await fetch(`${BASE_URL}/schedule/upcoming`, { headers: getHeaders() });
    return handleResponse<Draft[]>(res);
  },

  // --- Platforms ---

  getAvailablePlatforms: async (): Promise<{ platforms: string[] }> => {
    const res = await fetch(`${BASE_URL}/platforms/available`, { headers: getHeaders() });
    return handleResponse(res);
  },

  scheduleDraft: async (id: number, scheduledAt?: string): Promise<{ ok: boolean }> => {
    const body: Record<string, string> = {};
    if (scheduledAt) body.scheduled_at = scheduledAt;
    const res = await fetch(`${BASE_URL}/drafts/${id}/schedule`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  unscheduleDraft: async (id: number): Promise<{ ok: boolean }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/unschedule`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateDraftPlatforms: async (id: number, platforms: string[]): Promise<{ ok: boolean; platforms: string[] }> => {
    const res = await fetch(`${BASE_URL}/drafts/${id}/platforms`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ platforms }),
    });
    return handleResponse(res);
  },
};
