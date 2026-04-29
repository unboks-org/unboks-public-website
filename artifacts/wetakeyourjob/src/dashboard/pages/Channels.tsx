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
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
      Connected
    </span>
  );
  if (status === "needs_attention") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-amber-500">
      <AlertCircle className="w-3.5 h-3.5" />
      Needs attention
    </span>
  );
  if (status === "coming_soon") return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#94A3B8]">
      <Clock className="w-3.5 h-3.5" />
      Coming soon
    </span>
  );
  return (
    <span className="text-[13px] font-medium text-[#94A3B8]">Not connected</span>
  );
}

export default function Channels() {
  return (
    <div className="max-w-[840px] pb-16">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-[#0F172A] mb-1.5">Channels</h1>
        <p className="text-[14px] text-[#64748B]">
          Manage the channels connected to your Unboks inbox.
        </p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E5EAF0] shadow-[0_4px_24px_rgba(15,23,42,0.04)] overflow-hidden">
        {CHANNELS.map((ch, idx) => {
          const isLast = idx === CHANNELS.length - 1;
          const isMuted = ch.status === "coming_soon";
          return (
            <div
              key={ch.id}
              className={cn(
                "flex items-center gap-4 px-6 min-h-[72px] transition-colors",
                !isLast && "border-b border-[#F0F4F8]",
                isMuted ? "opacity-50" : "hover:bg-[#FAFBFC]"
              )}
            >
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 bg-[#F5F7FA]">
                <ch.icon className="w-5 h-5 text-[#64748B]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#0F172A] leading-tight">{ch.label}</p>
                <p className="text-[13px] text-[#64748B] mt-0.5">{ch.description}</p>
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
