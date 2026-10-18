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
import { parseBriefSheet, TEMPLATE_CSV, type BriefRow } from "@/lib/bulk-brief";

export function BulkBriefView() {
  const router = useRouter();
  const { toast } = useToast();
  const [rows, setRows] = useState<BriefRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [readError, setReadError] = useState("");
  const [busy, setBusy] = useState(false);
  // bump to start the upload box over (clears its internal state)
  const [uploadKey, setUploadKey] = useState(0);

  const validRows = rows?.filter((r) => r.valid) ?? [];
  const invalidCount = (rows?.length ?? 0) - validRows.length;

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([TEMPLATE_CSV], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_briefs_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const readFile = async (file?: File, name = "") => {
    setFileName(name);
    setReadError("");
    setRows(null);
    if (!file) return;
    const result = parseBriefSheet(await file.text());
    if (result.error) {
      setReadError(result.error);
      setUploadKey((k) => k + 1);
      return;
    }
    setRows(result.rows);
  };

  const startOver = () => {
    setRows(null);
    setFileName("");
    setReadError("");
    setUploadKey((k) => k + 1);
  };

  const generate = async () => {
    setBusy(true);
    try {
      const res = await sendJSON<{ count: number }>("/api/requests/bulk", "POST", {
        rows: validRows.map((r) => ({
          product: r.product,
          category: r.category,
          landing_url: r.landing_url,
          format_name: r.format_name || null,
        })),
      });
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
          <Button variant="secondary" onClick={downloadTemplate}>
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        }
      />

      <Card className="mb-4">
        <CardHeader title="Upload Sheet" />
        <div className="p-6">
          {rows === null ? (
            <div className="flex flex-col gap-3">
              <FileUpload
                key={uploadKey}
                accept=".csv"
                localOnly
                hint="CSV · Max 10 MB · columns: product, category, landing_url, format"
                onUploaded={(f) => readFile(f.file, f.name)}
              />
              {readError && (
                <p role="alert" className="text-body text-danger-ink">
                  {readError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-control border border-border bg-bg px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-label font-medium text-text">{fileName}</p>
                <p className="text-caption text-text-faint">
                  {rows.length} rows read · {validRows.length} valid, {invalidCount} need attention
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Tag tone="success">Parsed</Tag>
                <Button size="sm" variant="secondary" onClick={startOver}>
                  Choose another file
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {rows && (
        <Card>
          <CardHeader
            title="Parsed Briefs"
            badge={<Tag tone="gray">{rows.length} rows</Tag>}
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {["#", "Product", "Category", "Format", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-caption font-medium text-text-sub">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-b border-line last:border-0">
                    <td className="px-6 py-3 text-body text-text-faint">{r.n}</td>
                    <td className="px-6 py-3 text-label font-medium text-text">{r.product || "—"}</td>
                    <td className="px-6 py-3 text-body text-text-sub">{r.category || "—"}</td>
                    <td className="px-6 py-3 text-body text-text-sub">{r.format_name || "—"}</td>
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
        {rows && (
          <Button onClick={generate} loading={busy} disabled={validRows.length === 0}>
            {invalidCount > 0
              ? `Skip ${invalidCount} & Generate ${validRows.length} Briefs`
              : `Generate ${validRows.length} Briefs`}
          </Button>
        )}
      </div>
    </Page>
  );
}
