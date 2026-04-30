import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useCreateManualDraft, useAvailablePlatforms } from "@dashboard/hooks/use-client-api";
import { Button } from "@dashboard/components/ui/button";
import { Textarea } from "@dashboard/components/ui/textarea";
import { Input } from "@dashboard/components/ui/input";
import {
  PlusCircle, ArrowLeft, Send, CalendarDays, Instagram, Facebook, CheckCircle2, Globe,
} from "lucide-react";
import { XBrandIcon } from "@dashboard/components/ui/x-brand-icon";
import { cn } from "@dashboard/lib/utils";
import { ContentClass } from "@dashboard/lib/api";

const CLASS_OPTIONS: { value: ContentClass; label: string; desc: string; color: string }[] = [
  { value: "A", label: "Evergreen", desc: "Destination highlights, brand storytelling", color: "text-sky-500" },
  { value: "B", label: "Commercial", desc: "Availability, promotions, booking nudges", color: "text-emerald-500" },
  { value: "C", label: "Operational", desc: "Schedule changes, service updates", color: "text-orange-500" },
  { value: "D", label: "Reactive", desc: "Events, holidays, timely posts", color: "text-purple-500" },
];

export default function Create() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const createDraft = useCreateManualDraft();
  const { data: availablePlatformsData } = useAvailablePlatforms();
  const connectedPlatforms = availablePlatformsData?.platforms ?? ["instagram"];

  const [igCaption, setIgCaption] = useState("");
  const [fbCaption, setFbCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [contentClass, setContentClass] = useState<ContentClass>("D");
  const [visualSuggestion, setVisualSuggestion] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["instagram"]);

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) setPlatforms(platforms.filter((x) => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleCreate = () => {
    if (!igCaption.trim()) return;
    const hashtagList = hashtags.split(",").map((t) => t.trim()).filter(Boolean);
    createDraft.mutate(
      {
        instagram_caption: igCaption.trim(),
        facebook_caption: fbCaption.trim() || undefined,
        hashtags: hashtagList,
        content_class: contentClass,
        visual_suggestion: visualSuggestion.trim() || undefined,
        platforms,
      },
      {
        onSuccess: () => navigate("/dashboard/social"),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1 flex items-center gap-3">
          <PlusCircle className="w-7 h-7 text-primary" />
          Create Post
        </h1>
        <p className="text-muted-foreground text-sm">Write a post manually. It'll be created as approved and ready to publish.</p>
      </div>

      <div className="space-y-5">
        {/* Instagram Caption */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Instagram Caption *</label>
          <Textarea
            value={igCaption}
            onChange={(e) => setIgCaption(e.target.value)}
            placeholder="Write your Instagram caption..."
            className="min-h-[140px] bg-muted/50 border-border text-sm"
          />
        </div>

        {/* Facebook Caption */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Facebook Caption <span className="text-muted-foreground/50 normal-case">(optional — defaults to IG caption)</span></label>
          <Textarea
            value={fbCaption}
            onChange={(e) => setFbCaption(e.target.value)}
            placeholder="Write a different caption for Facebook, or leave blank..."
            className="min-h-[100px] bg-muted/50 border-border text-sm"
          />
        </div>

        {/* Hashtags */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Hashtags</label>
          <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#curacao, #boatlife, #caribbean"
            className="bg-muted/50 border-border text-sm"
          />
        </div>

        {/* Image Direction */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Image Direction <span className="text-muted-foreground/50 normal-case">(optional — guides AI image generation)</span></label>
          <Input
            value={visualSuggestion}
            onChange={(e) => setVisualSuggestion(e.target.value)}
            placeholder="e.g. Sunset over the ocean with a catamaran"
            className="bg-muted/50 border-border text-sm"
          />
        </div>

        {/* Content Class */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Post Type</label>
          <div className="grid grid-cols-2 gap-2">
            {CLASS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setContentClass(opt.value)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                  contentClass === opt.value
                    ? "bg-primary/10 border-primary/30"
                    : "border-border hover:border-primary/20 hover:bg-muted/30"
                )}
              >
                <span className={cn("text-lg font-bold mt-0.5", opt.color)}>{opt.value}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Platforms */}
        {connectedPlatforms.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Publish To</label>
            <div className="flex gap-2">
              {connectedPlatforms.map((p) => {
                const active = platforms.includes(p);
                const Icon = p === "instagram" ? Instagram
                  : p === "facebook" ? Facebook
                  : p === "twitter" ? XBrandIcon
                  : Globe;
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                      active
                        ? p === "instagram"
                          ? "bg-gradient-to-r from-fuchsia-500/15 to-rose-500/15 border-fuchsia-500/30 text-fuchsia-400"
                          : p === "twitter"
                          ? "bg-neutral-400/15 border-neutral-400/30 text-neutral-300"
                          : "bg-blue-500/15 border-blue-500/30 text-blue-400"
                        : "bg-muted/30 border-border text-muted-foreground/50 hover:text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {p === "twitter" ? "X" : p.charAt(0).toUpperCase() + p.slice(1)}
                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          onClick={handleCreate}
          disabled={!igCaption.trim() || createDraft.isPending}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="w-4 h-4 mr-2" />
          {createDraft.isPending ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </div>
  );
}
