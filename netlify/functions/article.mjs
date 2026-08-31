import { json, listArticles } from "./shared.mjs";
export default async request => {
  if (request.method !== "GET") return json({ error: "Méthode non autorisée." }, 405);
  const article = (await listArticles()).find(item => item.id === new URL(request.url).searchParams.get("id"));
  return article ? json(article) : json({ error: "Article introuvable." }, 404);
};
