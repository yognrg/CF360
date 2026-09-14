import { getActiveRequest, getScript } from "@/lib/db";
import { ScriptGeneration } from "@/components/pre-production/script-generation";
import { Card } from "@/components/ui/card";

export default function ScriptPage() {
  const request = getActiveRequest();
  const script = getScript(request.id);
  if (!script) {
    return (
      <Card className="p-8 text-center text-body text-text-sub">
        No script yet — validate a prompt first.
      </Card>
    );
  }
  return <ScriptGeneration initialScript={script} />;
}
