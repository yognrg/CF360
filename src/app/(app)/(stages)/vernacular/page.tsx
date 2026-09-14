import { getActiveRequest, listVariants } from "@/lib/db";
import { Page, RequestContextBar } from "@/components/shell/page-header";
import { VernacularView } from "@/components/stages/vernacular-view";

export default function VernacularPage() {
  const request = getActiveRequest();
  return (
    <Page>
      <RequestContextBar request={request} statusLabel="Localizing" statusTone="blue" />
      <VernacularView initialVariants={listVariants(request.id)} />
    </Page>
  );
}
