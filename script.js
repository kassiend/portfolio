/* ============================================================
   Dauren Kassen — portfolio interactions
   Minimal / Creative mode toggle + live Almaty clock
   ============================================================ */
(function () {
  "use strict";

  /* Native scrolling only — no smooth-scroll inertia (kept effortless). */

  /* ---- Pixel bird: fly across with random vertical drift ---- */
  const bird = document.querySelector(".sky-bird");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (bird && !reduced) {
    const rand = (a, b) => a + Math.random() * (b - a);
    let x, baseY, ampA, ampB, freqA, freqB, phaseA, phaseB, speed, tilt0, t, flying;

    const spawn = () => {
      x = -80;
      baseY = rand(24, 150);          // random height band near the top
      ampA = rand(10, 26);            // vertical wander amplitude
      ampB = rand(4, 12);
      freqA = rand(0.5, 1.1);
      freqB = rand(1.4, 2.4);
      phaseA = rand(0, Math.PI * 2);
      phaseB = rand(0, Math.PI * 2);
      speed = rand(55, 95);           // px per second
      t = 0;
      flying = true;
    };
    spawn();

    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (flying) {
        t += dt;
        x += speed * dt;
        const y = baseY + Math.sin(t * freqA + phaseA) * ampA + Math.sin(t * freqB + phaseB) * ampB;
        // tilt follows vertical velocity so it noses up/down naturally
        const vy = Math.cos(t * freqA + phaseA) * ampA * freqA + Math.cos(t * freqB + phaseB) * ampB * freqB;
        const tilt = Math.max(-22, Math.min(22, vy * 1.6));
        bird.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${tilt.toFixed(1)}deg)`;
        if (x > window.innerWidth + 90) {
          flying = false;
          setTimeout(spawn, rand(1200, 4200)); // pause, then a fresh random flight
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

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
