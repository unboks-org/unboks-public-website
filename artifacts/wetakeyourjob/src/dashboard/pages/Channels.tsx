import { CheckCircle2, Clock, Phone, Mail, Instagram, Facebook, Music2, AlertCircle } from "lucide-react";
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
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#1f883d]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#1f883d] shrink-0" />
      Connected
    </span>
  );
  if (status === "needs_attention") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#9a6700]">
      <AlertCircle className="w-3.5 h-3.5" />
      Needs attention
    </span>
  );
  if (status === "coming_soon") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#6e7781]">
      <Clock className="w-3.5 h-3.5" />
      Coming soon
    </span>
  );
  return (
    <span className="text-[13px] font-medium text-[#6e7781]">Not connected</span>
  );
}

export default function Channels() {
  return (
    <div className="max-w-[840px] pb-16">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-[#24292f] mb-1">Channels</h1>
        <p className="text-[13px] text-[#57606a]">
          Manage the channels connected to your Unboks inbox.
        </p>
      </div>

      <div className="bg-white border border-[#d0d7de] rounded-md overflow-hidden">
        {CHANNELS.map((ch, idx) => {
          const isMuted = ch.status === "coming_soon";
          return (
            <div
              key={ch.id}
              className={cn(
                "flex items-center gap-4 px-4 h-[52px] transition-colors",
                idx < CHANNELS.length - 1 && "border-b border-[#d0d7de]",
                isMuted ? "opacity-45" : "hover:bg-[#f6f8fa]"
              )}
            >
              <ch.icon className="w-[16px] h-[16px] text-[#57606a] shrink-0" />

              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium text-[#24292f]">{ch.label}</span>
                <span className="text-[13px] text-[#57606a] ml-3">{ch.description}</span>
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
