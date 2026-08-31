(() => {
  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/svg+xml";
  icon.href = location.pathname.includes("/admin/") ? "../favicon.svg" : "favicon.svg";
  document.head.append(icon);

  const root = document.documentElement;
  const saved = localStorage.getItem("kwetu-theme");
  if (saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches)) root.dataset.theme = "dark";
  document.querySelectorAll(".theme-toggle").forEach(button => {
    const set = () => {
      const dark = root.dataset.theme === "dark";
      button.textContent = dark ? "☀" : "◐";
      button.setAttribute("aria-label", dark ? "Activer le mode clair" : "Activer le mode sombre");
    };
    set();
    button.onclick = () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("kwetu-theme", root.dataset.theme);
      set();
    };
  });
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) toggle.onclick = () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "×" : "☰";
  };
})();
