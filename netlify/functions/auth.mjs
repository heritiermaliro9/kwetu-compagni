import { timingSafeEqual } from "node:crypto";
import { json, token } from "./shared.mjs";

const same = (value, expected) => {
  if (typeof value !== "string" || typeof expected !== "string") return false;
  const a = Buffer.from(value), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export default async request => {
  if (request.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);
  try {
    const { username, password, accessKey } = await request.json();
    const configured = process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_ACCESS_KEY && process.env.ADMIN_TOKEN_SECRET;
    if (!configured) return json({ error: "Administration non configurée. Ajoutez les variables Netlify requises." }, 503);
    const ok = same(username, process.env.ADMIN_USERNAME) && same(password, process.env.ADMIN_PASSWORD) && same(accessKey, process.env.ADMIN_ACCESS_KEY);
    return ok ? json({ token: token() }) : json({ error: "Identifiants, clé d’accès ou mot de passe incorrects." }, 401);
  } catch { return json({ error: "Demande de connexion invalide." }, 400); }
};
