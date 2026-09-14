import { getActiveRequest } from "@/lib/db";
import { Page, RequestContextBar } from "@/components/shell/page-header";
import { PublishingView } from "@/components/stages/publishing-view";

export default function PublishingPage() {
  const request = getActiveRequest();
  return (
    <Page>
      <RequestContextBar request={request} statusLabel="Ready to publish" statusTone="success" />
      <PublishingView />
    </Page>
  );
}
