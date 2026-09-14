"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import { Page, PageHeader } from "@/components/shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { sendJSON } from "@/lib/client";

interface ParsedRow {
  n: number;
  product: string;
  category: string;
  landing_url: string;
  format_name: string;
  language: string;
  valid: boolean;
  issue?: string;
}

// Sample parse result matching the design (24 rows; 6 shown; 1 invalid).
const PARSED: ParsedRow[] = [
  { n: 1, product: "Gold Loan", category: "Secured Loans", landing_url: "bajajfinserv.in/gold-loan", format_name: "Offer Reel", language: "Hindi", valid: true },
  { n: 2, product: "Personal Loan", category: "Unsecured Loans", landing_url: "bajajfinserv.in/personal-loan", format_name: "How-to Video", language: "Hindi", valid: true },
  { n: 3, product: "Home Loan", category: "Secured Loans", landing_url: "bajajfinserv.in/home-loan", format_name: "Overview", language: "Marathi", valid: true },
  { n: 4, product: "Business Loan", category: "Unsecured Loans", landing_url: "bajajfinserv.in/business-loan", format_name: "Feature & Benefits", language: "Tamil", valid: true },
  { n: 5, product: "Insurance", category: "Protection", landing_url: "", format_name: "Testimonial", language: "—", valid: false, issue: "Missing URL" },
  { n: 6, product: "Credit Card", category: "Cards", landing_url: "bajajfinserv.in/credit-card", format_name: "Eligibility", language: "Telugu", valid: true },
];

const TOTAL_ROWS = 24;

export function BulkBriefView() {
  const router = useRouter();
  const { toast } = useToast();
  const [parsed, setParsed] = useState(false);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);

  const validCount = PARSED.filter((r) => r.valid).length;
  const invalidCount = PARSED.length - validCount;

  const generate = async () => {
    setBusy(true);
    try {
      const rows = PARSED.filter((r) => r.valid).map((r) => ({
        product: r.product,
        category: r.category,
        landing_url: r.landing_url,
        format_name: r.format_name,
      }));
      const res = await sendJSON<{ count: number }>("/api/requests/bulk", "POST", { rows });
      toast({
        variant: "success",
        title: `${res.count} briefs generated`,
        description: "Added to the pipeline.",
      });
      router.push("/pipeline");
      router.refresh();
    } catch (e) {
      toast({
        variant: "error",
        title: "Bulk generation failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <PageHeader
        title="Bulk Video Brief"
        subtitle="Upload a sheet to generate multiple briefs at once."
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              toast({ variant: "info", title: "Template", description: "product_briefs_template.xlsx" })
            }
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        }
      />

      <Card className="mb-4">
        <CardHeader title="Upload Sheet" />
        <div className="p-6">
          {!parsed ? (
            <FileUpload
              accept=".xlsx,.csv"
              localOnly
              hint="XLSX or CSV · Max 10 MB"
              onUploaded={(f) => {
                setFileName(f.name);
                setParsed(true);
              }}
            />
          ) : (
            <div className="flex items-center justify-between rounded-control border border-border bg-bg px-4 py-3">
              <div>
                <p className="text-label font-medium text-text">{fileName || "product_briefs_apr.xlsx"}</p>
                <p className="text-caption text-text-faint">
                  {TOTAL_ROWS} rows parsed · {validCount + (TOTAL_ROWS - PARSED.length)} valid,{" "}
                  {invalidCount} needs attention
                </p>
              </div>
              <Tag tone="success">Parsed</Tag>
            </div>
          )}
        </div>
      </Card>

      {parsed && (
        <Card>
          <CardHeader
            title="Parsed Briefs"
            badge={<Tag tone="gray">{TOTAL_ROWS} rows</Tag>}
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {["#", "Product", "Format", "Language", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-caption font-medium text-text-sub">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARSED.map((r) => (
                  <tr key={r.n} className="border-b border-line last:border-0">
                    <td className="px-6 py-3 text-body text-text-faint">{r.n}</td>
                    <td className="px-6 py-3 text-label font-medium text-text">{r.product}</td>
                    <td className="px-6 py-3 text-body text-text-sub">{r.format_name}</td>
                    <td className="px-6 py-3 text-body text-text-sub">{r.language}</td>
                    <td className="px-6 py-3">
                      {r.valid ? (
                        <Tag tone="success">Valid</Tag>
                      ) : (
                        <Tag tone="warning">{r.issue}</Tag>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push("/pipeline")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {parsed && (
          <Button onClick={generate} loading={busy}>
            {invalidCount > 0
              ? `Fix ${invalidCount} & Generate ${validCount} Briefs`
              : `Generate ${validCount} Briefs`}
          </Button>
        )}
      </div>
    </Page>
  );
}
