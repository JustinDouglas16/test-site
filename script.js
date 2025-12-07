document.addEventListener("click", (e) => {
  if (!e.target.closest(".accordion button")) return;

  const button = e.target.closest("button");
  const expanded = button.getAttribute("aria-expanded") === "true";
  const panel = document.getElementById(button.getAttribute("aria-controls"));

  // collapse all others if you want single-open mode
  document
    .querySelectorAll('.accordion [aria-expanded="true"]')
    .forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      document.getElementById(btn.getAttribute("aria-controls")).hidden = true;
    });

  // toggle selected one
  button.setAttribute("aria-expanded", !expanded);
  panel.hidden = expanded;
});
