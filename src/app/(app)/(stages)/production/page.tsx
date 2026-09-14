import { getActiveRequest } from "@/lib/db";
import { Page, RequestContextBar } from "@/components/shell/page-header";
import { ProductionView } from "@/components/stages/production-view";

export default function ProductionPage() {
  const request = getActiveRequest();
  return (
    <Page>
      <RequestContextBar request={request} statusLabel="Rendering" statusTone="warning" />
      <ProductionView />
    </Page>
  );
}
