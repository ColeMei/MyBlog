// Drives the conic-gradient reading-progress ring around the scroll-up button.
(() => {
  "use strict";
  const btn = document.querySelector(".scroll-up");
  if (!btn) return;
  const root = document.documentElement;
  const update = () => {
    const max = root.scrollHeight - root.clientHeight;
    const p = max > 0 ? Math.min(100, Math.max(0, (root.scrollTop / max) * 100)) : 0;
    btn.style.setProperty("--scroll-progress", p + "%");
  };
  document.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
