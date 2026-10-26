/** URL-safe key for a playground item, used by /playground?open=<key> deep links. */
export function playgroundSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
