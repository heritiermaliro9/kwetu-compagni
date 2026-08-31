import { getSettings, json } from "./shared.mjs";
export default async request => request.method === "GET" ? json(await getSettings()) : json({ error: "Méthode non autorisée." }, 405);
