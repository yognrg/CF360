/**
 * Where each illustration lives in /public. The image slots show a placeholder
 * until a file exists at these paths. Prompts for every image are in
 * docs/image-prompts.md.
 */

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// template names differ slightly from format names ("How to Video", "Buying Guides")
const COVER_ALIASES: Record<string, string> = {
  "how-to-video": "how-to-video",
  "buying-guides": "buying-guide",
};

/** 16:9 cover for a format or template card, e.g. /media/formats/offer-reel.jpg */
export function formatCover(name: string) {
  const s = slug(name);
  return `/media/formats/${COVER_ALIASES[s] ?? s}.jpg`;
}

/** 9:16 still for a script beat ("Hook · 0-3s" -> /media/storyboard/hook.jpg) */
export function beatStill(beat: string) {
  return `/media/storyboard/${slug(beat.split(/[·\-–\s]/)[0] ?? beat)}.jpg`;
}

export const STORYBOARD_BEATS = ["Hook", "Offer", "Benefit", "CTA"] as const;

/** 9:16 poster for a format's reference video */
export function referencePoster(name: string) {
  const s = slug(name);
  return `/media/reference/${COVER_ALIASES[s] ?? s}.jpg`;
}
