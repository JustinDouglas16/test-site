// Smooth open/close using max-height + opacity.
// Keeps aria-expanded and aria-hidden in sync and supports single-open mode.
document.addEventListener("DOMContentLoaded", () => {
  const accordion = document.querySelector(".accordion");
  if (!accordion) return;

  const buttons = accordion.querySelectorAll("button[aria-controls]");

  // Initialize panels (support markup that used `hidden` initially).
  buttons.forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    // Make sure the panel is measurable and under our control
    panel.hidden = false;
    const expanded = btn.getAttribute("aria-expanded") === "true";
    panel.classList.toggle("is-open", expanded);
    panel.setAttribute("aria-hidden", String(!expanded));
    if (expanded) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.opacity = "1";
      // free height after transition so content can grow naturally
      requestAnimationFrame(() => {
        panel.style.maxHeight = "none";
      });
    } else {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
      panel.style.overflow = "hidden";
    }
  });

  accordion.addEventListener("click", (e) => {
    const btn = e.target.closest("button[aria-controls]");
    if (!btn || !accordion.contains(btn)) return;
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    const expanded = btn.getAttribute("aria-expanded") === "true";

    // close all others (single-open mode)
    accordion
      .querySelectorAll('button[aria-expanded="true"]')
      .forEach((otherBtn) => {
        if (otherBtn !== btn) closePanel(otherBtn);
      });

    if (expanded) {
      closePanel(btn);
    } else {
      openPanel(btn);
    }
  });

  function openPanel(btn) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    panel.classList.add("is-open");
    panel.style.overflow = "hidden";

    // from current height to scrollHeight -> animate
    // if maxHeight was 'none', set to current height first
    const computed = window.getComputedStyle(panel);
    if (computed.maxHeight === "none") {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    // ensure we have a starting point
    const start = panel.getBoundingClientRect().height;
    panel.style.maxHeight = start + "px";
    // force reflow
    panel.getBoundingClientRect();

    // go to full height
    panel.style.transition =
      "max-height 350ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease";
    panel.style.maxHeight = panel.scrollHeight + "px";
    panel.style.opacity = "1";

    function onEnd(ev) {
      if (ev.target !== panel || ev.propertyName !== "max-height") return;
      panel.style.maxHeight = "none"; // let it size naturally thereafter
      panel.style.overflow = "";
      panel.removeEventListener("transitionend", onEnd);
    }
    panel.addEventListener("transitionend", onEnd);
  }

  function closePanel(btn) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");

    // if maxHeight is 'none' (auto), set to measured height first
    const computed = window.getComputedStyle(panel);
    if (computed.maxHeight === "none") {
      panel.style.maxHeight = panel.scrollHeight + "px";
      // force reflow so the change is registered before animating to 0
      panel.getBoundingClientRect();
    }

    panel.style.transition =
      "max-height 280ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease";
    panel.style.maxHeight = "0px";
    panel.style.opacity = "0";
    panel.style.overflow = "hidden";

    function onEnd(ev) {
      if (ev.target !== panel || ev.propertyName !== "max-height") return;
      panel.classList.remove("is-open");
      panel.style.maxHeight = "0px";
      panel.removeEventListener("transitionend", onEnd);
    }
    panel.addEventListener("transitionend", onEnd);
  }
});
