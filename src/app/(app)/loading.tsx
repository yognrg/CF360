import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center py-24 text-text-faint">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}
