import { listRequests } from "@/lib/db";
import { toRequestRow } from "@/lib/dto";
import { PipelineClient } from "@/components/pipeline/pipeline-client";

export default function PipelinePage() {
  const rows = listRequests("all").map(toRequestRow);
  return <PipelineClient initialRows={rows} />;
}
