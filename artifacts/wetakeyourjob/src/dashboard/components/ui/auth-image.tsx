import { useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@dashboard/lib/api";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@dashboard/lib/utils";

interface AuthImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  draftId: number;
  fallbackText?: string;
}

export function AuthImage({ draftId, className, fallbackText, ...props }: AuthImageProps) {
  const prevUrlRef = useRef<string | null>(null);

  const { data: blob, isLoading, isError } = useQuery({
    queryKey: ["draft-image", draftId],
    queryFn: () => api.getDraftImageBlob(draftId),
    enabled: !!draftId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const objectUrl = useMemo(() => {
    if (!blob || blob.size === 0) return null;
    return URL.createObjectURL(blob);
  }, [blob]);

  useEffect(() => {
    const prev = prevUrlRef.current;
    prevUrlRef.current = objectUrl;
    if (prev && prev !== objectUrl) {
      URL.revokeObjectURL(prev);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  if (isLoading) {
    return <Skeleton className={cn("w-full h-full bg-muted/50", className)} />;
  }

  if (isError || !objectUrl) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted/50 text-muted-foreground p-4 text-center", className)}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        {fallbackText !== "" && <span className="text-xs">{fallbackText || "No image available"}</span>}
      </div>
    );
  }

  return <img src={objectUrl} className={cn("object-cover", className)} {...props} />;
}
