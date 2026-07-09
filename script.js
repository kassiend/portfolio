/* ============================================================
   Dauren Kassen — portfolio interactions
   Minimal / Creative mode toggle + live Almaty clock
   ============================================================ */
(function () {
  "use strict";

  /* Native scrolling only — no smooth-scroll inertia (kept effortless). */
  /* Eagle flies via pure CSS (see .sky-bird animation) — no JS needed. */

  /* ---- Minimal / Creative mode toggle ---- */
  const btns = document.querySelectorAll(".mode-btn");
  const setMode = (mode) => {
    const creative = mode === "creative";
    document.body.classList.toggle("creative-mode", creative);
    btns.forEach((b) => {
      const on = b.dataset.mode === mode;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    const co = document.querySelector(".creative-only");
    if (co) co.setAttribute("aria-hidden", String(!creative));
    try { localStorage.setItem("dk-mode", mode); } catch (e) {}
    window.scrollTo({ top: 0 });
  };
  btns.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  let saved = "creative";
  try { saved = localStorage.getItem("dk-mode") || "creative"; } catch (e) {}
  setMode(saved);

  /* ---- Live clock, Almaty time (UTC+5) — both minimal & creative ---- */
  const clocks = document.querySelectorAll("#clock, #clock2");
  if (clocks.length) {
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Almaty",
      hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
    });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const get = (t) => (parts.find((p) => p.type === t) || {}).value || "";
      clocks.forEach((c) => {
        c.querySelector("[data-h]").textContent = pad(get("hour"));
        c.querySelector("[data-m]").textContent = pad(get("minute"));
        c.querySelector("[data-s]").textContent = pad(get("second"));
        c.querySelector("[data-ampm]").textContent = (get("dayPeriod") || "AM").toUpperCase();
      });
    };
    tick();
    setInterval(tick, 1000);
  }
})();
