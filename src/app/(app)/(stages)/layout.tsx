import { getCurrentUser, can } from "@/lib/auth";
import { AccessRestricted } from "@/components/shell/access-restricted";

/** All stage screens (Production → Monitoring) require producer access. */
export default function StagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();
  if (!can(user, "act_pipeline")) return <AccessRestricted role={user.role} />;
  return <>{children}</>;
}
