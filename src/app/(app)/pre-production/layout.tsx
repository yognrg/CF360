import { getCurrentUser, can } from "@/lib/auth";
import { getActiveRequest } from "@/lib/db";
import { Page } from "@/components/shell/page-header";
import { RequestContextBar } from "@/components/shell/page-header";
import { AccessRestricted } from "@/components/shell/access-restricted";
import { PreProdStepper } from "@/components/pre-production/pre-prod-stepper";

export default function PreProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();
  if (!can(user, "act_pipeline")) return <AccessRestricted role={user.role} />;

  const request = getActiveRequest();
  return (
    <Page>
      <RequestContextBar request={request} statusLabel="In Progress" statusTone="blue" />
      {children}
      <PreProdStepper />
    </Page>
  );
}
