import { authenticate, getSettings, json, saveSettings } from "./shared.mjs";
export default async request => {
  if (!authenticate(request)) return json({ error: "Session expirée. Veuillez vous reconnecter." }, 401);
  if (request.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);
  const { whatsappNumber } = await request.json();
  const number = String(whatsappNumber || "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(number)) return json({ error: "Entrez un numéro WhatsApp international valide, sans le signe + ni espaces." }, 422);
  const settings = { ...(await getSettings()), whatsappNumber: number };
  await saveSettings(settings); return json(settings);
};
