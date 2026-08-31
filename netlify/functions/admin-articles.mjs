import { randomUUID } from "node:crypto";
import { authenticate, images, json, listArticles, saveArticles } from "./shared.mjs";
export default async request => {
  if (!authenticate(request)) return json({ error: "Session expirée. Veuillez vous reconnecter." }, 401);
  let items = await listArticles();
  if (request.method === "DELETE") {
    const id = new URL(request.url).searchParams.get("id");
    if (!id || !items.some(article => article.id === id)) return json({ error: "Article introuvable." }, 404);
    items = items.filter(article => article.id !== id); await saveArticles(items); return json(items);
  }
  if (request.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);
  const form = await request.formData();
  const title = String(form.get("title") || "").trim(), category = String(form.get("category") || "").trim(), excerpt = String(form.get("excerpt") || "").trim(), content = String(form.get("content") || "").trim();
  if (!title || title.length > 160 || !category || category.length > 50 || !excerpt || excerpt.length > 300 || !content || content.length > 10000) return json({ error: "Informations de l’article invalides." }, 422);
  let image = ""; const file = form.get("image");
  if (typeof File !== "undefined" && file instanceof File && file.size) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 4 * 1024 * 1024) return json({ error: "Image JPG, PNG ou WebP de 4 Mo maximum." }, 422);
    const key = randomUUID(); await images().set(key, file); image = "/api/image?key=" + key;
  }
  items.unshift({ id: randomUUID(), title, category, excerpt, content, image, publishedAt: new Date().toISOString() });
  await saveArticles(items); return json(items, 201);
};
