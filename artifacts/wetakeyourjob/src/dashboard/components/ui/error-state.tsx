import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@dashboard/components/ui/button";
import { getErrorMessage } from "@dashboard/lib/error";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ error, onRetry, title = "Failed to load data" }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-rose-400" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{getErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-border text-foreground hover:bg-muted">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      )}
    </div>
  );
}
