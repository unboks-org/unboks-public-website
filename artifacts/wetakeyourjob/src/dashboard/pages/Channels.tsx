import { CheckCircle2, XCircle, Clock, Phone, Mail, Instagram, Facebook, Twitter, Music2, AlertCircle } from "lucide-react";
import { cn } from "@dashboard/lib/utils";

type ChannelStatus = "connected" | "not_connected" | "coming_soon" | "needs_attention";

interface ChannelCard {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  status: ChannelStatus;
  detail?: string;
}

const CHANNELS: ChannelCard[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Customer messages via WhatsApp Business",
    icon: Phone,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    accentColor: "border-l-emerald-500",
    status: "connected",
    detail: "Receiving and responding to messages",
  },
  {
    id: "email",
    label: "Email",
    description: "Inbound email handling",
    icon: Mail,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10",
    accentColor: "border-l-sky-500",
    status: "not_connected",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Instagram Direct Messages",
    icon: Instagram,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
    accentColor: "border-l-pink-500",
    status: "not_connected",
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Facebook Messenger",
    icon: Facebook,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    accentColor: "border-l-blue-500",
    status: "not_connected",
  },
  {
    id: "x",
    label: "X / Twitter",
    description: "X Direct Messages",
    icon: Twitter,
    iconColor: "text-foreground/60",
    iconBg: "bg-foreground/5",
    accentColor: "border-l-foreground/20",
    status: "coming_soon",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "TikTok Direct Messages",
    icon: Music2,
    iconColor: "text-foreground/60",
    iconBg: "bg-foreground/5",
    accentColor: "border-l-foreground/20",
    status: "coming_soon",
  },
];

function StatusBadge({ status }: { status: ChannelStatus }) {
  if (status === "connected") return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
      <CheckCircle2 className="w-4 h-4" /> Connected
    </span>
  );
  if (status === "not_connected") return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/60">
      <XCircle className="w-4 h-4" /> Not connected
    </span>
  );
  if (status === "needs_attention") return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
      <AlertCircle className="w-4 h-4" /> Needs attention
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/40">
      <Clock className="w-4 h-4" /> Coming soon
    </span>
  );
}

export default function Channels() {
  const connected = CHANNELS.filter(c => c.status === "connected").length;
  const total = CHANNELS.filter(c => c.status !== "coming_soon").length;

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">Channels</h1>
        <p className="text-muted-foreground text-[15px]">
          {connected} of {total} channels connected. Channel setup is handled by Unboks — contact us if anything needs attention.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30">
        <AlertCircle className="w-4 h-4 text-muted-foreground/60 mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Unboks connects and manages your channels. If a channel needs to be reconnected or a new one added,
          contact your Unboks account manager or <strong className="text-foreground/80">send a message via WhatsApp</strong> to schedule a quick call.
        </p>
      </div>

      {/* Channel grid */}
      <div className="space-y-3">
        {CHANNELS.map((ch) => (
          <div
            key={ch.id}
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-l-4 border-t border-r border-b border-border/70 transition-all",
              ch.accentColor,
              ch.status === "connected"
                ? "bg-card shadow-sm"
                : ch.status === "coming_soon"
                  ? "bg-muted/20 opacity-60"
                  : "bg-card shadow-sm"
            )}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", ch.iconBg)}>
              <ch.icon className={cn("w-5 h-5", ch.iconColor)} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-foreground leading-tight">{ch.label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {ch.status === "connected" && ch.detail ? ch.detail : ch.description}
              </p>
            </div>

            <div className="shrink-0">
              <StatusBadge status={ch.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Needs attention CTA */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <p className="text-[15px] font-semibold text-foreground">Need to connect or fix a channel?</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Channel connections are set up by Unboks — we handle Meta Business verification, WhatsApp Business API, and inbox routing on your behalf. You don't need to configure anything yourself.
        </p>
        <a
          href="https://wa.me/59996881585"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
        >
          <Phone className="w-4 h-4" />
          Contact Unboks on WhatsApp
        </a>
      </div>
    </div>
  );
}
