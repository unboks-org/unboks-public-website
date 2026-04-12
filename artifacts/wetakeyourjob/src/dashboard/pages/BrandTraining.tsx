import { useState } from "react";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import {
  useTrainingExamples, useTrainingMutations,
  useBrandProfile, useBrandProfileMutations, useAnalyzeVisual,
} from "@dashboard/hooks/use-bluemarlin";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@dashboard/components/ui/dialog";
import { Textarea } from "@dashboard/components/ui/textarea";
import { Input } from "@dashboard/components/ui/input";
import {
  BrainCircuit, ArrowLeft, Plus, Trash2, Sparkles, Quote, Pencil,
  Instagram, Facebook, MessageSquare, ShieldAlert, Palette, Mic,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_META: Record<string, { label: string; icon: typeof Mic; color: string }> = {
  voice_rules: { label: "Voice", icon: Mic, color: "text-teal-500" },
  content_rules: { label: "Content", icon: MessageSquare, color: "text-blue-500" },
  boundaries: { label: "Boundaries", icon: ShieldAlert, color: "text-rose-500" },
  visual_rules: { label: "Visual", icon: Palette, color: "text-purple-500" },
};

export default function BrandTraining() {
  const goBack = useGoBack();
  const { data: examples, isLoading: examplesLoading } = useTrainingExamples();
  const { upload, remove, analyze } = useTrainingMutations();
  const { data: brandProfile } = useBrandProfile();
  const { remove: removeRule, addRule, update: updateRule } = useBrandProfileMutations();
  const analyzeVisual = useAnalyzeVisual();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [file, setFile] = useState<File | null>(null);

  const [editingRule, setEditingRule] = useState<{ id: number; text: string } | null>(null);
  const [addRuleOpen, setAddRuleOpen] = useState(false);
  const [addRuleCategory, setAddRuleCategory] = useState("voice_rules");
  const [addRuleText, setAddRuleText] = useState("");

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleUpload = () => {
    if (!captionText.trim()) return;
    upload.mutate(
      { captionText: captionText.trim(), platform, file: file || undefined },
      {
        onSuccess: () => {
          setUploadOpen(false);
          setCaptionText("");
          setPlatform("instagram");
          setFile(null);
        },
      }
    );
  };

  // Flatten all brand profile rules
  const allRules = brandProfile
    ? Object.entries(brandProfile).flatMap(([, rules]) => rules)
    : [];
  const filteredRules = activeCategory === "all"
    ? allRules
    : allRules.filter((r) => r.category === activeCategory);
  const categories = Object.keys(CATEGORY_META);

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1 flex items-center gap-3">
          <BrainCircuit className="w-7 h-7 text-primary" />
          Brand Training
        </h1>
        <p className="text-muted-foreground text-sm">Upload example posts to define your brand style. Analyze them to build your content rules.</p>
      </div>

      {/* ── Training Examples ──────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Training Examples</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => analyze.mutate()}
              disabled={analyze.isPending || !examples?.length}
              variant="outline"
              className="border-border"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {analyze.isPending ? "Analyzing..." : "Analyze Examples"}
            </Button>
            <Button onClick={() => setUploadOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Upload Example
            </Button>
          </div>
        </div>

        {examplesLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : examples && examples.length > 0 ? (
          <div className="space-y-3">
            {examples.map((ex) => (
              <div key={ex.id} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border group">
                <Quote className="w-4 h-4 text-primary/40 mt-0.5 shrink-0 rotate-180" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">{ex.caption_text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {ex.platform && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/70">
                        {ex.platform === "instagram" ? <Instagram className="w-3 h-3" /> : ex.platform === "facebook" ? <Facebook className="w-3 h-3" /> : null}
                        {ex.platform}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground/50">
                      {formatDistanceToNow(new Date(ex.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => remove.mutate(ex.id)}
                  disabled={remove.isPending}
                  className="p-1 rounded text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors shrink-0"
                  title="Remove example"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-border">
            <BrainCircuit className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No training examples yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Upload your best social media posts to set the tone and style for your content.</p>
          </div>
        )}
      </div>

      {/* ── Brand Profile Rules ────────────────────────────────────── */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-foreground">Brand Profile</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-border"
              onClick={() => analyzeVisual.mutate()}
              disabled={analyzeVisual.isPending}
            >
              <Palette className="w-3.5 h-3.5 mr-1.5" />
              {analyzeVisual.isPending ? "Analyzing..." : "Analyze Photos"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border"
              onClick={() => setAddRuleOpen(true)}
            >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Rule
          </Button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              activeCategory === "all" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All ({allRules.length})
          </button>
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = allRules.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5",
                  activeCategory === cat ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <meta.icon className={cn("w-3 h-3", activeCategory === cat ? meta.color : "")} />
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Rules list */}
        {filteredRules.length > 0 ? (
          <div className="space-y-2">
            {filteredRules.map((rule) => {
              const meta = CATEGORY_META[rule.category] ?? { label: rule.category, icon: Quote, color: "text-muted-foreground" };
              return (
                <div key={rule.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border group">
                  <meta.icon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", meta.color)} />
                  <div className="flex-1 min-w-0">
                    {editingRule?.id === rule.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingRule.text}
                          onChange={(e) => setEditingRule({ ...editingRule, text: e.target.value })}
                          className="text-sm min-h-[60px] bg-background"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => { updateRule.mutate({ id: rule.id, rule: editingRule.text }); setEditingRule(null); }} disabled={updateRule.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7">Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingRule(null)} className="text-xs h-7">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-foreground/80">{rule.rule}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded",
                            rule.source === "manual" ? "bg-blue-500/10 text-blue-400" : "bg-muted text-muted-foreground/60"
                          )}>
                            {rule.source}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {editingRule?.id !== rule.id && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditingRule({ id: rule.id, text: rule.rule })}
                        className="p-1 rounded text-sky-400/50 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                        title="Edit rule"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeRule.mutate(rule.id)}
                        disabled={removeRule.isPending}
                        className="p-1 rounded text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                        title="Remove rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic py-4 text-center">
            {allRules.length === 0
              ? "No brand rules yet. Upload examples and click Analyze Examples."
              : "No rules in this category."}
          </p>
        )}
      </div>

      {/* ── Upload Dialog ──────────────────────────────────────────── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Training Example</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Caption Text *</label>
              <Textarea
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="Paste an example social media post caption..."
                className="min-h-[120px] bg-muted/50 border-border text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Platform</label>
              <div className="flex gap-2">
                {["instagram", "facebook", "other"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5",
                      platform === p
                        ? "bg-primary/15 text-primary border-primary/30"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p === "instagram" && <Instagram className="w-3 h-3" />}
                    {p === "facebook" && <Facebook className="w-3 h-3" />}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Image (optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-muted/50 border-border text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadOpen(false)} className="text-foreground/70">Cancel</Button>
            <Button
              onClick={handleUpload}
              disabled={!captionText.trim() || upload.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {upload.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Rule Dialog ────────────────────────────────────────── */}
      <Dialog open={addRuleOpen} onOpenChange={setAddRuleOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manual Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setAddRuleCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5",
                        addRuleCategory === cat
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <meta.icon className="w-3 h-3" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Rule</label>
              <Textarea
                value={addRuleText}
                onChange={(e) => setAddRuleText(e.target.value)}
                placeholder="e.g. Never use discount language or urgency pressure"
                className="min-h-[80px] bg-muted/50 border-border text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddRuleOpen(false)} className="text-foreground/70">Cancel</Button>
            <Button
              onClick={() => {
                if (!addRuleText.trim()) return;
                addRule.mutate(
                  { category: addRuleCategory, rule: addRuleText.trim() },
                  { onSuccess: () => { setAddRuleOpen(false); setAddRuleText(""); } }
                );
              }}
              disabled={!addRuleText.trim() || addRule.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {addRule.isPending ? "Adding..." : "Add Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
