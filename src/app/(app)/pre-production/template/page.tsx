import { listTemplates } from "@/lib/db";
import { TemplateSelection } from "@/components/pre-production/template-selection";

export default function TemplatePage() {
  return <TemplateSelection templates={listTemplates()} />;
}
