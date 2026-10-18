import { getActiveRequest, listTemplates } from "@/lib/db";
import { TemplateSelection } from "@/components/pre-production/template-selection";

export default function TemplatePage() {
  return (
    <TemplateSelection
      templates={listTemplates()}
      chosenId={getActiveRequest().template_id ?? null}
    />
  );
}
