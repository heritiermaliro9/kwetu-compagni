import { json, listProducts } from "./shared.mjs";
export default async request => request.method === "GET" ? json(await listProducts()) : json({ error: "Méthode non autorisée." }, 405);
