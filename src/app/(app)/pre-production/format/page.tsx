import { getActiveRequest, listFormats } from "@/lib/db";
import { FormatSelection } from "@/components/pre-production/format-selection";

export default function FormatPage() {
  return (
    <FormatSelection formats={listFormats()} chosenName={getActiveRequest().format_name} />
  );
}
