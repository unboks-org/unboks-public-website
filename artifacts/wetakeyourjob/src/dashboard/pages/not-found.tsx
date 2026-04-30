import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-5xl font-bold text-[#24292f] mb-3">404</h1>
      <p className="text-[15px] text-[#57606a] mb-8 max-w-md">
        This route doesn't exist. You may have followed a broken link or typed the URL incorrectly.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center h-9 px-4 border border-[#d0d7de] rounded-md text-[14px] font-medium text-[#24292f] bg-[#f6f8fa] hover:bg-[#d0d7de]/50 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
