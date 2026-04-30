import {
  useConfig, useGoogleDriveStatus, useGoogleDriveMutations, useGoogleDriveFolders,
  useScheduleSlots, useUpcomingSchedule, useScheduleSlotMutations, useDryRun,
} from "@dashboard/hooks/use-bluemarlin";
import { api } from "@dashboard/lib/api";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { Button } from "@dashboard/components/ui/button";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import {
  HardDrive, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Info, Code, Map, Ship, Sun, Palette, ArrowRight, ArrowLeft, FolderOpen,
  Settings as SettingsIcon, CalendarDays, Plus, Clock, X, Mail, BrainCircuit, RefreshCw, Zap, Wrench,
  LayoutDashboard, Share2, PenSquare, BarChart3,
  Building2, FileText, Users, Bell, Globe, Upload, Lock, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useEmailSettings } from "@dashboard/hooks/use-email-settings";
import { useFeatureToggles } from "@dashboard/lib/feature-toggles";
import { useBookingsLabel } from "@dashboard/hooks/use-bookings-label";
import { cn } from "@dashboard/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// ─── Config parser (kept for Advanced View) ───────────────────────────────────
interface ConfigSection { title: string; content: string; icon: typeof Info; color: string; }

function parseConfig(raw: string): ConfigSection[] {
  const sectionRegex = /===\s+([A-Z\s]+?)\s+===/g;
  const sections: ConfigSection[] = [];
  const matches = [...raw.matchAll(sectionRegex)];
  const iconMap: Record<string, { icon: typeof Info; color: string }> = {
    BUSINESS: { icon: Map, color: "text-primary" },
    TRIPS: { icon: Ship, color: "text-blue-400" },
    SEASON: { icon: Sun, color: "text-amber-400" },
    BRAND: { icon: Palette, color: "text-purple-400" },
  };
  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1].trim();
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : raw.length;
    const content = raw.slice(start, end).trim();
    const key = Object.keys(iconMap).find(k => title.toUpperCase().includes(k));
    const { icon, color } = key ? iconMap[key] : { icon: Info, color: "text-foreground/70" };
    sections.push({ title, content, icon, color });
  }
  return sections;
}

// ─── Accordion Section (flat Google-settings style) ───────────────────────────
function AccordionSection({ title, subtitle, icon: Icon, defaultOpen = false, children }: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-4 px-5 h-[56px] text-left border-b border-[#E5E7EB] transition-colors",
          open ? "bg-[#F8FAFC]" : "bg-white hover:bg-[#F8FAFC]"
        )}
      >
        <Icon className="w-[18px] h-[18px] text-[#5F6368] shrink-0" />
        <div className="flex-1 min-w-0 flex items-baseline gap-2 overflow-hidden">
          <span className="text-[14px] font-medium text-[#202124] shrink-0">{title}</span>
          {subtitle && <span className="text-[13px] text-[#5F6368] truncate">{subtitle}</span>}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-[#5F6368] shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[#E5E7EB] bg-[#F8FAFC]"
          >
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Placeholder coming-soon notice ──────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-2 text-[13px] text-[#5F6368]">
      <Clock className="w-[14px] h-[14px] shrink-0" />
      <span>{label} — coming soon. Contact Unboks to configure this.</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Settings() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { data: config, isLoading: configLoading, error: configError, refetch: refetchConfig } = useConfig();
  const { data: driveStatus } = useGoogleDriveStatus();
  const { disconnect: driveDisconnect, setFolder: driveSetFolder, sync: driveSync } = useGoogleDriveMutations();
  const { data: driveFolders } = useGoogleDriveFolders(!!driveStatus?.connected);
  const { data: dryRunData, toggle: toggleDryRun } = useDryRun();
  const [expandedConfigSection, setExpandedConfigSection] = useState<number | null>(null);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Schedule
  const { data: scheduleSlots } = useScheduleSlots();
  const { data: upcoming } = useUpcomingSchedule();
  const { updateSlots } = useScheduleSlotMutations();
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [editSlots, setEditSlots] = useState<{ day_of_week: string; time_utc: string }[] | null>(null);
  const [newSlotDay, setNewSlotDay] = useState("Monday");
  const [newSlotTime, setNewSlotTime] = useState("10:00");
  const slots = editSlots ?? (scheduleSlots ?? []).map((s) => ({ day_of_week: s.day_of_week, time_utc: s.time_utc }));
  const isDirty = editSlots !== null;

  const addSlot = () => {
    const next = [...slots, { day_of_week: newSlotDay, time_utc: newSlotTime }];
    next.sort((a, b) => DAYS.indexOf(a.day_of_week) - DAYS.indexOf(b.day_of_week) || a.time_utc.localeCompare(b.time_utc));
    setEditSlots(next);
  };
  const removeSlot = (idx: number) => {
    setEditSlots(slots.filter((_, i) => i !== idx));
  };
  const saveSlots = () => {
    updateSlots.mutate(slots, { onSuccess: () => setEditSlots(null) });
  };

  const configSections = config?.context ? parseConfig(config.context) : [];

  const { settings: emailSettings, save: saveEmailSettings } = useEmailSettings();
  const { features, toggle: toggleFeature } = useFeatureToggles();
  const { label: bookingsLabel, save: saveBookingsLabel } = useBookingsLabel();

  return (
    <div className="max-w-3xl pb-16">
      <button onClick={goBack} className="flex items-center gap-1.5 text-[13px] text-[#5F6368] hover:text-[#202124] transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="mb-5">
        <h1 className="text-[18px] font-semibold text-[#202124] mb-1">Settings</h1>
        <p className="text-[13px] text-[#5F6368]">Manage your account, AI knowledge, team, and integrations.</p>
      </div>

      <div className="bg-white border-t border-[#E5E7EB]">

      {/* ── Business Info ─────────────────────────────────────────────────── */}
      <AccordionSection
        title="Business Info"
        subtitle="Name, contact details, and opening hours"
        icon={Building2}
      >
        <ComingSoon label="Business profile editor" />
      </AccordionSection>

      {/* ── Source of Truth ───────────────────────────────────────────────── */}
      <AccordionSection
        title="Source of Truth"
        subtitle="Documents and quick updates the AI can draw from"
        icon={FileText}
      >
        <div className="space-y-4">
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Upload documents (PDFs, Word files) or add quick text updates so the AI has accurate, up-to-date information to draw from when answering customers.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <Upload className="w-4 h-4" /> Upload document
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Add quick update
            </button>
          </div>
          <ComingSoon label="Document upload and quick updates" />
        </div>
      </AccordionSection>

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <AccordionSection
        title="Rules"
        subtitle="What the AI must always do or never do"
        icon={Lock}
      >
        <ComingSoon label="Rule editor" />
      </AccordionSection>

      {/* ── Team Members ─────────────────────────────────────────────────── */}
      <AccordionSection
        title="Team Members"
        subtitle="Who has access to this dashboard"
        icon={Users}
      >
        <ComingSoon label="Team member management" />
      </AccordionSection>

      {/* ── Notifications ────────────────────────────────────────────────── */}
      <AccordionSection
        title="Notifications"
        subtitle="How and when you receive alerts"
        icon={Bell}
      >
        <ComingSoon label="Notification preferences" />
      </AccordionSection>

      {/* ── Language ─────────────────────────────────────────────────────── */}
      <AccordionSection
        title="Language"
        subtitle="Dashboard and AI response language"
        icon={Globe}
      >
        <ComingSoon label="Language settings" />
      </AccordionSection>

      {/* ── Email Integration ────────────────────────────────────────────── */}
      <AccordionSection
        title="Email Integration"
        subtitle={emailSettings.enabled ? `Active — ${emailSettings.client === "gmail" ? "Gmail" : "Default mail app"}` : "Disabled"}
        icon={Mail}
      >
        <div className="space-y-5">
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Enable this to get an email compose button inside each conversation. When you click it, a pre-filled draft opens directly in your chosen email client — nothing is sent automatically.
          </p>

          {/* Enable toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
            <div>
              <p className="text-[15px] font-semibold text-foreground">Enable email button in Messages</p>
              <p className="text-sm text-muted-foreground mt-0.5">Shows a compose button on each conversation</p>
            </div>
            <button
              onClick={() => saveEmailSettings({ ...emailSettings, enabled: !emailSettings.enabled })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                emailSettings.enabled ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                emailSettings.enabled ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>

          {/* Client choice */}
          {emailSettings.enabled && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email client</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => saveEmailSettings({ ...emailSettings, client: "gmail" })}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    emailSettings.client === "gmail"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/30 hover:border-border/80"
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-muted dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">Gmail</p>
                    <p className="text-sm text-muted-foreground">Opens in browser</p>
                  </div>
                  {emailSettings.client === "gmail" && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                </button>
                <button
                  onClick={() => saveEmailSettings({ ...emailSettings, client: "mailto" })}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    emailSettings.client === "mailto"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/30 hover:border-border/80"
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">Default App</p>
                    <p className="text-sm text-muted-foreground">Outlook, Apple Mail…</p>
                  </div>
                  {emailSettings.client === "mailto" && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* ── Advanced (legacy sections) ────────────────────────────────────── */}
      <div>
        <button
          onClick={() => setAdvancedOpen((o) => !o)}
          className={cn(
            "w-full flex items-center gap-4 px-5 h-[56px] text-left border-b border-[#E5E7EB] transition-colors",
            advancedOpen ? "bg-[#F8FAFC]" : "bg-white hover:bg-[#F8FAFC]"
          )}
        >
          <Wrench className="w-[18px] h-[18px] text-[#5F6368] shrink-0" />
          <div className="flex-1 min-w-0 flex items-baseline gap-2 overflow-hidden">
            <span className="text-[14px] font-medium text-[#202124] shrink-0">Advanced</span>
            <span className="text-[13px] text-[#5F6368] truncate">System configuration, social publishing, and developer tools</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-[#5F6368] shrink-0 transition-transform duration-200", advancedOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {advancedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-[#E5E7EB] bg-[#F8FAFC]"
            >
              <div className="py-2 space-y-0">

                {/* Sidebar Modules */}
                <div className="border-b border-[#E5E7EB]">
                  <button
                    onClick={() => setModulesOpen((o) => !o)}
                    className={cn(
                      "w-full px-5 h-[56px] flex items-center gap-4 text-left transition-colors",
                      modulesOpen ? "bg-[#EEF2F7]" : "hover:bg-[#EEF2F7]"
                    )}
                  >
                    <LayoutDashboard className="w-[18px] h-[18px] text-[#5F6368] shrink-0" />
                    <div className="flex-1 min-w-0 flex items-baseline gap-2">
                      <span className="text-[14px] font-medium text-[#202124] shrink-0">Sidebar Modules</span>
                      <span className="text-[13px] text-[#5F6368]">Choose which sections appear in the navigation</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-[#5F6368] shrink-0 transition-transform duration-200", modulesOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {modulesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border overflow-hidden"
                      >
                        {/* Social Media toggle */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                          <div className="flex items-center gap-3">
                            <Share2 className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-[15px] font-medium text-foreground">Social Media</p>
                              <p className="text-sm text-muted-foreground mt-0.5">Content pipeline and post management</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFeature("showSocial")}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
                              features.showSocial ? "bg-primary" : "bg-muted-foreground/20"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                                features.showSocial ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        {/* Create toggle */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                          <div className="flex items-center gap-3">
                            <PenSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-[15px] font-medium text-foreground">Create</p>
                              <p className="text-sm text-muted-foreground mt-0.5">Manual content creation tools</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFeature("showCreate")}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
                              features.showCreate ? "bg-primary" : "bg-muted-foreground/20"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                                features.showCreate ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        {/* Bookings / Orders label */}
                        <div className="flex items-center justify-between px-5 py-4">
                          <div className="flex items-center gap-3">
                            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-[15px] font-medium text-foreground">Bookings / Orders Label</p>
                              <p className="text-sm text-muted-foreground mt-0.5">Customize the sidebar navigation label</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5 shrink-0">
                            <button
                              onClick={() => saveBookingsLabel("Bookings")}
                              className={cn(
                                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                                bookingsLabel === "Bookings" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Bookings
                            </button>
                            <button
                              onClick={() => saveBookingsLabel("Orders")}
                              className={cn(
                                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                                bookingsLabel === "Orders" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Orders
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Analytics shortcut */}
                <button
                  onClick={() => navigate("/dashboard/settings/analytics")}
                  className="w-full flex items-center gap-4 px-5 h-[56px] text-left border-b border-[#E5E7EB] hover:bg-[#EEF2F7] transition-colors"
                >
                  <BarChart3 className="w-[18px] h-[18px] text-[#5F6368] shrink-0" />
                  <div className="flex-1 min-w-0 flex items-baseline gap-2">
                    <span className="text-[14px] font-medium text-[#202124] shrink-0">Analytics</span>
                    <span className="text-[13px] text-[#5F6368]">Inbox volume, platform stats, and activity trends</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5F6368] shrink-0" />
                </button>

                {/* Brand Training shortcut */}
                <button
                  onClick={() => navigate("/dashboard/training")}
                  className="w-full flex items-center gap-4 px-5 h-[56px] text-left border-b border-[#E5E7EB] hover:bg-[#EEF2F7] transition-colors"
                >
                  <BrainCircuit className="w-[18px] h-[18px] text-[#5F6368] shrink-0" />
                  <div className="flex-1 min-w-0 flex items-baseline gap-2">
                    <span className="text-[14px] font-medium text-[#202124] shrink-0">Brand Training</span>
                    <span className="text-[13px] text-[#5F6368]">Examples, voice rules, and visual guidelines</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5F6368] shrink-0" />
                </button>

                {/* Assets & Connections */}
                <AccordionSection
                  title="Assets & Connections"
                  subtitle="Google Drive, photo library"
                  icon={FolderOpen}
                >
                  <div className="space-y-4">
                    {/* Google Drive */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <HardDrive className="w-4.5 h-4.5 text-blue-400" style={{ width: 18, height: 18 }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Google Drive</p>
                          <p className="text-xs text-muted-foreground">
                            {driveStatus?.connected
                              ? driveStatus.folder_id ? "Connected — syncing from selected folder" : "Connected — no folder selected"
                              : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {driveStatus?.connected ? (
                          <>
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                            </span>
                            <Button size="sm" variant="outline" onClick={() => driveDisconnect.mutate()} disabled={driveDisconnect.isPending} className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10">
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Disconnect
                            </Button>
                          </>
                        ) : (
                          <a href={api.getGoogleAuthUrl(window.location.href)}>
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Connect</Button>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Folder picker + sync */}
                    {driveStatus?.connected && (
                      <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Sync Folder</p>
                            <p className="text-xs text-muted-foreground">
                              {driveStatus.folder_id ? "Syncing from selected folder" : "Select a folder to sync photos from"}
                            </p>
                          </div>
                          {driveStatus.folder_id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => driveSync.mutate()}
                              disabled={driveSync.isPending}
                              className="border-border"
                            >
                              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", driveSync.isPending && "animate-spin")} />
                              {driveSync.isPending ? "Syncing…" : "Sync Now"}
                            </Button>
                          )}
                        </div>
                        {driveFolders && driveFolders.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {driveFolders.map((f) => (
                              <button
                                key={f.id}
                                onClick={() => driveSetFolder.mutate(f.id)}
                                disabled={driveSetFolder.isPending}
                                className={cn(
                                  "flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all",
                                  driveStatus.folder_id === f.id
                                    ? "border-blue-500 bg-blue-500/10 text-foreground font-medium"
                                    : "border-border bg-muted/30 text-muted-foreground hover:border-border/80"
                                )}
                              >
                                <FolderOpen className="w-4 h-4 shrink-0" />
                                <span className="truncate">{f.name}</span>
                                {driveStatus.folder_id === f.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 ml-auto shrink-0" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Asset Library link */}
                    <button
                      onClick={() => navigate("/dashboard/assets")}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                          <FolderOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">Photo & Video Library</p>
                          <p className="text-xs text-muted-foreground">Browse and manage uploaded assets</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </AccordionSection>

                {/* Schedule & Automation */}
                <AccordionSection
                  title="Schedule & Automation"
                  subtitle={`${(scheduleSlots ?? []).length} weekly slot${(scheduleSlots ?? []).length !== 1 ? "s" : ""}`}
                  icon={CalendarDays}
                >
                  <div className="space-y-4">
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      Set weekly time slots for auto-publishing. When you schedule a draft without a specific time, it picks the next open slot.
                    </p>

                    {/* Current slots */}
                    {slots.length > 0 ? (
                      <div className="space-y-2">
                        {slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border group">
                            <CalendarDays className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="text-[15px] font-medium text-foreground flex-1">{slot.day_of_week}</span>
                            <span className="text-[15px] text-muted-foreground font-mono">{slot.time_utc} UTC</span>
                            <button
                              onClick={() => removeSlot(idx)}
                              className="p-1 rounded text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[15px] text-muted-foreground italic">No weekly slots configured. Posts must be scheduled manually.</p>
                    )}

                    {/* Add slot */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={newSlotDay}
                        onChange={(e) => setNewSlotDay(e.target.value)}
                        className="px-3 py-1.5 text-[15px] rounded-lg border border-border bg-muted/50 text-foreground"
                      >
                        {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <input
                        type="time"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        className="px-3 py-1.5 text-[15px] rounded-lg border border-border bg-muted/50 text-foreground font-mono"
                      />
                      <Button size="sm" variant="outline" onClick={addSlot} className="border-border">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Slot
                      </Button>
                      {isDirty && (
                        <Button size="sm" onClick={saveSlots} disabled={updateSlots.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">
                          {updateSlots.isPending ? "Saving..." : "Save Schedule"}
                        </Button>
                      )}
                    </div>

                    {/* Upcoming */}
                    {upcoming && upcoming.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming Posts</p>
                        <div className="space-y-2">
                          {upcoming.map((draft) => (
                            <div key={draft.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              <p className="text-[15px] text-foreground/85 flex-1 truncate">{draft.instagram_caption.slice(0, 60)}...</p>
                              <span className="text-sm text-muted-foreground font-mono shrink-0">
                                {draft.scheduled_at ? format(new Date(draft.scheduled_at), 'MMM d, h:mm a') : '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionSection>

                {/* Capacity & Availability */}
                <AccordionSection
                  title="Capacity & Availability"
                  subtitle="Real-time trip occupancy"
                  icon={Ship}
                >
                  <div className="space-y-3">
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      View real-time availability across all trips. The system uses this data to write urgency-calibrated social posts.
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/bookings")}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 transition-colors"
                    >
                      <p className="text-[15px] font-semibold text-foreground">Open Capacity Checker</p>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </AccordionSection>

                {/* Developer */}
                <AccordionSection
                  title="Developer"
                  subtitle="Dry-run mode and experimental settings"
                  icon={Wrench}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Publishing Mode</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {dryRunData?.dry_run ? "Dry run — posts are not published to social media" : "Live — posts are published to social media"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDryRun.mutate()}
                        disabled={toggleDryRun.isPending}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0",
                          dryRunData?.dry_run ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      >
                        <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                          dryRunData?.dry_run ? "translate-x-1" : "translate-x-6"
                        )} />
                      </button>
                    </div>
                  </div>
                </AccordionSection>

                {/* Advanced View */}
                <AccordionSection
                  title="Advanced View"
                  subtitle="System context, raw configuration"
                  icon={Code}
                >
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Technical configuration injected into the system. Read-only.</p>

                    {configLoading ? (
                      <Skeleton className="h-48 w-full rounded-xl" />
                    ) : configError ? (
                      <ErrorState error={configError} onRetry={() => refetchConfig()} title="Failed to load configuration" />
                    ) : (
                      <>
                        {/* Parsed sections */}
                        {configSections.length > 0 && (
                          <div className="space-y-2">
                            {configSections.map((section, idx) => (
                              <div key={idx} className="rounded-xl border border-border overflow-hidden">
                                <button
                                  onClick={() => setExpandedConfigSection(expandedConfigSection === idx ? null : idx)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                                >
                                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center bg-muted")}>
                                    <section.icon className={cn("w-4 h-4", section.color)} />
                                  </div>
                                  <span className="flex-1 text-[15px] font-medium text-foreground">{section.title}</span>
                                  {expandedConfigSection === idx
                                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                </button>
                                {expandedConfigSection === idx && (
                                  <div className="px-4 pb-4 border-t border-border">
                                    <pre className="text-sm text-foreground/80 font-mono whitespace-pre-wrap leading-relaxed mt-3">
                                      {section.content}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Raw context */}
                        <div className="rounded-xl border border-border overflow-hidden">
                          <div className="bg-muted/50 px-4 py-2 border-b border-border flex justify-between items-center">
                            <span className="text-sm font-mono text-muted-foreground">system_context.txt</span>
                            <span className="text-sm text-primary/80">Read-only</span>
                          </div>
                          <div className="p-4 max-h-72 overflow-y-auto">
                            <pre className="text-sm text-foreground/75 font-mono whitespace-pre-wrap leading-relaxed">
                              {config?.context || "No configuration loaded."}
                            </pre>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </AccordionSection>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      </div>
    </div>
  );
}
