"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A fixed-shape image box. It shows a quiet placeholder until the file at
 * `src` loads, so dropping the image into /public is all it takes to fill it.
 * The box sets the shape (pass an aspect class), so nothing shifts on load.
 */
export function ImageSlot({
  src,
  alt,
  label,
  className,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // a server-rendered image can finish (or fail) before React attaches onLoad,
  // so check where it already stands once mounted
  useEffect(() => {
    const el = img.current;
    if (!el || !el.complete) return;
    if (el.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden rounded-control bg-bg", className)}>
      {!loaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-control border border-dashed border-border text-text-faint"
          aria-hidden={!failed}
        >
          <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
          {label && <span className="px-1 text-center text-caption">{label}</span>}
        </div>
      )}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover transition-opacity", loaded ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
