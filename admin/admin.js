(() => {
  const tokenKey = "kwetu-admin-token";
  const catalog = document.getElementById("catalog-list");
  const message = document.getElementById(catalog ? "dashboard-message" : "login-message");
  const setMessage = (text = "", type = "") => {
    if (!message) return;
    message.textContent = text;
    message.className = "form-message " + type;
  };
  const logout = () => { sessionStorage.removeItem(tokenKey); location.href = "index.html"; };
  const api = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    const auth = sessionStorage.getItem(tokenKey);
    if (auth) headers.set("Authorization", "Bearer " + auth);
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 404) throw new Error("API introuvable : les fonctions Netlify ne sont pas déployées. Utilisez un déploiement GitHub/GitLab puis redéployez.");
    if (response.status === 401) { logout(); throw new Error("Votre session a expiré."); }
    if (!response.ok) throw new Error(data.error || "Une erreur est survenue.");
    return data;
  };
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const renderCatalog = items => {
    const count = document.getElementById("catalog-count");
    if (count) count.textContent = items.length + " produit(s) publié(s)";
    catalog.replaceChildren();
    if (!items.length) {
      catalog.append(element("p", "Aucun produit publié pour le moment.", "muted-copy"));
      return;
    }
    items.forEach(product => {
      const row = element("article", "", "admin-product-row");
      if (product.image) {
        const image = document.createElement("img");
        image.src = product.image; image.alt = ""; image.className = "admin-thumb";
        row.append(image);
      }
      const details = element("div", "", "admin-product-text");
      details.append(element("strong", product.name), element("span", Number(product.price).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " $"));
      row.append(details);
      const remove = element("button", "Supprimer", "table-link danger");
      remove.type = "button";
      remove.addEventListener("click", async () => {
        if (!confirm("Supprimer « " + product.name + " » ?")) return;
        try {
          setMessage("Suppression…");
          const items = await api("/api/admin/products?id=" + encodeURIComponent(product.id), { method: "DELETE" });
          renderCatalog(items); setMessage("Produit supprimé.", "success");
        } catch (error) { setMessage(error.message, "error"); }
      });
      row.append(remove); catalog.append(row);
    });
  };
  const loadCatalog = async () => {
    try { renderCatalog(await api("/api/products")); }
    catch (error) { setMessage(error.message, "error"); }
  };
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const button = document.getElementById("login-button");
      button.disabled = true; setMessage("Connexion en cours…");
      try {
        const values = Object.fromEntries(new FormData(loginForm));
        const response = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
        const data = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error("API introuvable : les fonctions Netlify ne sont pas déployées. Utilisez un déploiement GitHub/GitLab puis redéployez.");
        if (!response.ok) throw new Error(data.error || "Connexion impossible.");
        sessionStorage.setItem(tokenKey, data.token);
        location.href = "dashboard.html";
      } catch (error) {
        const detail = error instanceof TypeError ? "Connexion impossible : les fonctions Netlify ne sont pas disponibles. Déployez via GitHub/GitLab, puis redéployez le site." : error.message;
        setMessage(detail, "error"); button.disabled = false;
      }
    });
    return;
  }
  if (!sessionStorage.getItem(tokenKey)) { logout(); return; }
  document.getElementById("logout-button")?.addEventListener("click", logout);
  document.getElementById("product-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget, button = document.getElementById("publish-button");
    button.disabled = true; setMessage("Publication en cours…");
    try {
      const items = await api("/api/admin/products", { method: "POST", body: new FormData(form) });
      form.reset(); renderCatalog(items); setMessage("Produit publié avec succès.", "success");
    } catch (error) { setMessage(error.message, "error"); }
    finally { button.disabled = false; }
  });
  loadCatalog();
})();
