import { getActiveRequest, getPrompt } from "@/lib/db";
import { Page, RequestContextBar } from "@/components/shell/page-header";
import { LeadReviewView } from "@/components/stages/lead-review-view";

export default function LeadReviewPage() {
  const request = getActiveRequest();
  const prompt = getPrompt(request.id) ?? null;
  return (
    <Page>
      <RequestContextBar
        request={request}
        statusLabel="Awaiting approval"
        statusTone="warning"
      />
      <LeadReviewView prompt={prompt} />
    </Page>
  );
}
