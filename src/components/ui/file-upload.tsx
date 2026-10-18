"use client";

import { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export type UploadState = "default" | "uploading" | "success" | "error";

const MAX_BYTES = Number(
  process.env.NEXT_PUBLIC_CF360_MAX_UPLOAD_BYTES || 10 * 1024 * 1024,
);

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  /** The chosen file itself (local-only mode, where it is read in the browser). */
  file?: File;
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function FileUpload({
  accept,
  maxBytes = MAX_BYTES,
  uploadUrl = "/api/upload",
  onUploaded,
  hint,
  /** Skip the server round-trip: size-check locally and go straight to success. */
  localOnly = false,
  /** Force a state for the component gallery / documentation. */
  demoState,
}: {
  accept?: string;
  maxBytes?: number;
  uploadUrl?: string;
  onUploaded?: (file: UploadedFile) => void;
  hint?: string;
  localOnly?: boolean;
  demoState?: { state: UploadState; fileName?: string; message?: string; progress?: number };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>(demoState?.state ?? "default");
  const [progress, setProgress] = useState(demoState?.progress ?? 0);
  const [fileName, setFileName] = useState(demoState?.fileName ?? "");
  const [fileSize, setFileSize] = useState(0);
  const [message, setMessage] = useState(demoState?.message ?? "");
  const [dragging, setDragging] = useState(false);

  const isDemo = !!demoState;

  const reset = () => {
    setState("default");
    setProgress(0);
    setFileName("");
    setFileSize(0);
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = useCallback(
    (file: File) => {
      setFileName(file.name);
      setFileSize(file.size);

      // Client-side guard mirrors the server limit → Error state.
      if (file.size > maxBytes) {
        setState("error");
        setMessage(
          `File is ${fmtSize(file.size)} — exceeds the ${fmtSize(maxBytes)} limit.`,
        );
        return;
      }

      setState("uploading");
      setProgress(0);

      // Local-only mode: no server upload (used where the file is parsed
      // client-side, e.g. the bulk brief sheet). Simulate a brief progress.
      if (localOnly) {
        let p = 0;
        const t = setInterval(() => {
          p = Math.min(100, p + 25);
          setProgress(p);
          if (p >= 100) {
            clearInterval(t);
            setState("success");
            onUploaded?.({ url: "", name: file.name, size: file.size, file });
          }
        }, 80);
        return;
      }

      const form = new FormData();
      form.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText) as UploadedFile;
            setState("success");
            setProgress(100);
            onUploaded?.(res);
          } catch {
            setState("error");
            setMessage("Server returned an unexpected response.");
          }
        } else {
          let msg = "Upload failed. Please try again.";
          try {
            msg = (JSON.parse(xhr.responseText).error as string) || msg;
          } catch {}
          setState("error");
          setMessage(msg);
        }
      };
      xhr.onerror = () => {
        setState("error");
        setMessage("Network error during upload.");
      };
      xhr.send(form);
    },
    [maxBytes, onUploaded, uploadUrl, localOnly],
  );

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  // ── DEFAULT ────────────────────────────────────────────────────────────────
  if (state === "default") {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && !isDemo) upload(file);
        }}
        onClick={() => !isDemo && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-border bg-bg px-6 py-8 text-center transition-colors hover:border-primary/50",
          dragging && "border-primary bg-primary-soft",
        )}
      >
        <UploadCloud className="h-8 w-8 text-text-faint" />
        <p className="text-label text-text">
          <span className="text-primary">Click to browse</span> or drag & drop
        </p>
        <p className="text-caption text-text-faint">
          {hint ?? `Max ${fmtSize(maxBytes)}`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onPick}
          className="hidden"
        />
      </div>
    );
  }

  // ── UPLOADING ──────────────────────────────────────────────────────────────
  if (state === "uploading") {
    return (
      <div className="rounded-card border border-border bg-surface p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-label text-text">{fileName}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-bg">
              <div
                className="h-full rounded-pill bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-caption tabular-nums text-text-sub">
            {progress}%
          </span>
        </div>
      </div>
    );
  }

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div className="flex items-center gap-3 rounded-card border border-success/30 bg-success-soft p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-label text-text">{fileName}</p>
          <p className="text-caption text-text-sub">
            {fileSize ? `${fmtSize(fileSize)} · ` : ""}Uploaded
          </p>
        </div>
        <FileText className="h-4 w-4 shrink-0 text-text-faint" />
        {!isDemo && (
          <button
            onClick={reset}
            aria-label="Remove"
            className="shrink-0 rounded-control p-1 text-text-faint hover:bg-surface hover:text-text-sub"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-3 rounded-card border border-danger/30 bg-danger-soft p-4">
      <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-label text-text">{fileName || "Upload failed"}</p>
        <p className="text-caption text-danger-ink">{message}</p>
      </div>
      {!isDemo && (
        <Button size="sm" variant="secondary" onClick={reset}>
          Retry
        </Button>
      )}
    </div>
  );
}
