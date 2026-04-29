import { CheckCircle2, XCircle, Clock, Phone, Mail, Instagram, Facebook, Music2, AlertCircle } from "lucide-react";
import { XBrandIcon } from "@dashboard/components/ui/x-brand-icon";
import { cn } from "@dashboard/lib/utils";

type ChannelStatus = "connected" | "not_connected" | "coming_soon" | "needs_attention";

interface ChannelCard {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  status: ChannelStatus;
}

const CHANNELS: ChannelCard[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Receiving and responding to messages",
    icon: Phone,
    status: "connected",
  },
  {
    id: "email",
    label: "Email",
    description: "Inbound email handling",
    icon: Mail,
    status: "not_connected",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Instagram Direct Messages",
    icon: Instagram,
    status: "not_connected",
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Facebook Messenger",
    icon: Facebook,
    status: "not_connected",
  },
  {
    id: "x",
    label: "X",
    description: "X Direct Messages",
    icon: XBrandIcon,
    status: "coming_soon",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "TikTok Direct Messages",
    icon: Music2,
    status: "coming_soon",
  },
];

function StatusBadge({ status }: { status: ChannelStatus }) {
  if (status === "connected") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
      Connected
    </span>
  );
  if (status === "needs_attention") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-amber-500 dark:text-amber-400">
      <AlertCircle className="w-3.5 h-3.5" />
      Needs attention
    </span>
  );
  if (status === "coming_soon") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground/50">
      <Clock className="w-3.5 h-3.5" />
      Coming soon
    </span>
  );
  return (
    <span className="text-[13px] font-medium text-muted-foreground/50">
      Not connected
    </span>
  );
}

export default function Channels() {
  return (
    <div className="max-w-[900px] pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1.5">Channels</h1>
        <p className="text-[15px] text-muted-foreground">
          Manage the channels connected to your Unboks inbox.
        </p>
      </div>

      <div className="space-y-2.5">
        {CHANNELS.map((ch) => {
          const isMuted = ch.status === "coming_soon";
          return (
            <div
              key={ch.id}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all",
                "border-border bg-card",
                isMuted && "opacity-55"
              )}
            >
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-muted dark:bg-white/[0.06]">
                <ch.icon className="w-[18px] h-[18px] text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground leading-tight">{ch.label}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">{ch.description}</p>
              </div>

              <div className="shrink-0">
                <StatusBadge status={ch.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
