import { Button } from "@dashboard/components/ui/button";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0D2A42] to-[#091726] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
        <Compass className="w-10 h-10 text-primary/60" />
      </div>
      <h1 className="text-6xl font-display font-bold text-white mb-2">404</h1>
      <p className="text-xl text-white/60 mb-8 max-w-md">
        This route doesn't exist. You may have followed a broken link or typed the URL incorrectly.
      </p>
      <Link to="/dashboard">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-3 text-base">
          Return to Overview
        </Button>
      </Link>
    </div>
  );
}
