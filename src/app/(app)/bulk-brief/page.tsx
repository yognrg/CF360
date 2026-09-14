import { getCurrentUser, can } from "@/lib/auth";
import { AccessRestricted } from "@/components/shell/access-restricted";
import { BulkBriefView } from "@/components/pipeline/bulk-brief-view";

export default function BulkBriefPage() {
  const user = getCurrentUser();
  if (!can(user, "raise_request")) return <AccessRestricted role={user.role} />;
  return <BulkBriefView />;
}
