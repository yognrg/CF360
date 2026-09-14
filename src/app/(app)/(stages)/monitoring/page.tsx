import { getActiveRequest, listKpis, listMetrics } from "@/lib/db";
import { Page, RequestContextBar } from "@/components/shell/page-header";
import { MonitoringView } from "@/components/stages/monitoring-view";

export default function MonitoringPage() {
  const request = getActiveRequest();
  const metrics = listMetrics(request.id);
  return (
    <Page>
      <RequestContextBar request={request} statusLabel="Published" statusTone="success" />
      <MonitoringView
        kpis={listKpis(request.id)}
        channels={metrics.filter((m) => m.kind === "channel")}
        languages={metrics.filter((m) => m.kind === "language")}
      />
    </Page>
  );
}
