import type { MediaKind } from "@/lib/types";

type Props = {
  kind: MediaKind;
  url: string;
  poster?: string;
  alt?: string;
  className?: string;
  /**
   * Render behaviour on mobile. Videos autoplay muted on desktop but we
   * respect `playsInline` so iOS can decide what's best.
   */
  objectFit?: "cover" | "contain";
};

/**
 * Single component that renders an image, gif, or video fill. Every
 * home-page tile and playground tile goes through this so the admin
 * doesn't have to reason about different asset types — the CMS picks
 * the kind, we pick the element.
 *
 * When the URL is empty we render a blank — the tile still reserves
 * space, which matches the grey placeholder look of the original static
 * site before any assets were uploaded.
 */
export function MediaAsset({
  kind,
  url,
  poster,
  alt = "",
  className = "",
  objectFit = "cover",
}: Props) {
  if (!url) {
    // Neutral placeholder so the grid renders before assets are added.
    return <div className={`absolute inset-0 bg-mute ${className}`} aria-hidden />;
  }

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  if (kind === "video") {
    return (
      <video
        className={`absolute inset-0 w-full h-full ${fitClass} ${className}`}
        src={url}
        poster={poster || undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={alt || undefined}
      />
    );
  }

  // Image + gif share the same element. Browsers animate gifs natively.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`absolute inset-0 w-full h-full ${fitClass} ${className}`}
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
