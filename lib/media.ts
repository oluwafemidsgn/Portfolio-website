import type { MediaKind } from "./types";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv|ogg)$/i;
const IMAGE_EXT = /\.(gif|png|jpe?g|webp|avif|svg)$/i;

function pathOf(url: string): string {
  try {
    return new URL(url, "http://local").pathname;
  } catch {
    return url.split(/[?#]/)[0];
  }
}

/**
 * True when a URL points at a video file. Checks the file extension and
 * Cloudinary's `/video/upload/` delivery path (which may have no extension
 * or transformation segments like `/f_auto,q_auto/`).
 */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const path = pathOf(url.trim());
  return VIDEO_EXT.test(path) || /\/video\/upload\//i.test(path);
}

/**
 * Picks the element to render for a URL. The URL wins over the stored
 * kind when it's unambiguous, so pasting an .mp4 while the dropdown still
 * says "image" (or vice versa) still renders correctly.
 */
export function resolveMediaKind(kind: MediaKind, url: string): MediaKind {
  if (isVideoUrl(url)) return "video";
  if (kind === "video" && IMAGE_EXT.test(pathOf(url.trim()))) {
    return /\.gif$/i.test(pathOf(url.trim())) ? "gif" : "image";
  }
  return kind;
}
