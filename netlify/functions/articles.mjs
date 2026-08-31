import { json, listArticles } from "./shared.mjs";
export default async request => request.method === "GET" ? json(await listArticles()) : json({ error: "Méthode non autorisée." }, 405);
