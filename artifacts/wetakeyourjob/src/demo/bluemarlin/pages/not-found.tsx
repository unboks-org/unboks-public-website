import { Link } from 'react-router-dom';
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="demo-section-shell flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <div className="flex mb-4 gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist in the BlueMarlin Tours demo.
        </p>
        <Link
          to="/demo/bluemarlin/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Back to Demo Home
        </Link>
      </div>
    </div>
  );
}
