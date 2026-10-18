/** Reading the bulk brief sheet (CSV) in the browser. */

export const MAX_BULK_ROWS = 200;

export const TEMPLATE_CSV =
  "product,category,landing_url,format\n" +
  "Gold Loan,Secured Loans,bajajfinserv.in/gold-loan,Offer Reel\n";

export interface BriefRow {
  n: number;
  product: string;
  category: string;
  landing_url: string;
  format_name: string;
  valid: boolean;
  issue?: string;
}

/** Split CSV text into rows of cells. Handles quotes, escaped quotes, CRLF and a BOM. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const COLUMNS: Record<string, string[]> = {
  product: ["product", "product name"],
  category: ["category"],
  landing_url: ["landing_url", "landing url", "landing page url", "url"],
  format_name: ["format", "format_name", "format name"],
};

/** Turn the sheet into brief rows, flagging the ones that cannot be generated. */
export function parseBriefSheet(text: string): { rows: BriefRow[]; error?: string } {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], error: "The file is empty." };

  const header = table[0].map((h) => h.trim().toLowerCase());
  const col = (key: string) => header.findIndex((h) => COLUMNS[key].includes(h));
  const idx = { product: col("product"), category: col("category"), url: col("landing_url"), format: col("format_name") };
  const missing = (["product", "category", "landing_url"] as const).filter(
    (k) => col(k) === -1,
  );
  if (missing.length) {
    return {
      rows: [],
      error: `Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Download the template for the expected headers.`,
    };
  }
  const body = table.slice(1);
  if (body.length === 0) return { rows: [], error: "The sheet has a header but no rows." };
  if (body.length > MAX_BULK_ROWS) {
    return { rows: [], error: `The sheet has ${body.length} rows. The limit is ${MAX_BULK_ROWS}.` };
  }

  const rows = body.map((cells, i): BriefRow => {
    const get = (j: number) => (j >= 0 ? (cells[j] ?? "").trim() : "");
    const row = {
      n: i + 1,
      product: get(idx.product),
      category: get(idx.category),
      landing_url: get(idx.url),
      format_name: get(idx.format),
    };
    const issue = !row.product
      ? "Missing product"
      : !row.category
        ? "Missing category"
        : !row.landing_url
          ? "Missing URL"
          : undefined;
    return { ...row, valid: !issue, issue };
  });
  return { rows };
}
