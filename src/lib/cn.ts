import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge doesn't know our custom font-size utilities (text-display,
 * text-label, …). Without this, it treats `text-label` as a text COLOR and
 * strips a real color like `text-white` that precedes it. Registering the
 * custom sizes under the font-size group keeps size and color independent.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "title",
            "heading",
            "label",
            "body",
            "body-relaxed",
            "caption",
          ],
        },
      ],
    },
  },
});

/** Merge conditional class names, de-duplicating conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
