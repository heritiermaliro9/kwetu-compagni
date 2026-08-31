import { randomUUID } from "node:crypto";
import { authenticate, images, json, listProducts, saveProducts } from "./shared.mjs";
export default async request => {
  if (!authenticate(request)) return json({ error: "Session expirée. Veuillez vous reconnecter." }, 401);
  let items = await listProducts();
  if (request.method === "DELETE") {
    const id = new URL(request.url).searchParams.get("id");
    if (!id || !items.some(product => product.id === id)) return json({ error: "Produit introuvable." }, 404);
    items = items.filter(product => product.id !== id); await saveProducts(items); return json(items);
  }
  if (request.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);
  const form = await request.formData();
  const name = String(form.get("name") || "").trim(), description = String(form.get("description") || "").trim(), price = Number(form.get("price"));
  if (!name || name.length > 120 || !description || description.length > 1000 || !Number.isFinite(price) || price < 0 || price > 100000000) return json({ error: "Informations produit invalides." }, 422);
  let image = ""; const file = form.get("image");
  if (typeof File !== "undefined" && file instanceof File && file.size) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024) return json({ error: "Image JPG, PNG ou WebP de 4 Mo maximum." }, 422);
    const key = randomUUID(); await images().set(key, file); image = "/api/image?key=" + key;
  }
  items.unshift({ id: randomUUID(), name, description, price, image }); await saveProducts(items); return json(items, 201);
};
