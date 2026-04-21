/**
 * Inline script that sets the theme *before* first paint.
 *
 * Runs synchronously in the document head so the correct `data-theme`
 * attribute is already on <html> by the time the browser paints the
 * body — no flash of the opposite theme on hard refresh.
 *
 * Reads the user's saved preference from localStorage and falls back
 * to the system `prefers-color-scheme`. Safe in SSR because the whole
 * thing is a string.
 */
export function ThemeScript() {
  const js = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var theme;
        if (stored === "light" || stored === "dark") {
          theme = stored;
        } else {
          theme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        }
        document.documentElement.setAttribute("data-theme", theme);
      } catch (_) {
        // Either localStorage is blocked or matchMedia isn't available —
        // leave <html> in its default (light) state.
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
