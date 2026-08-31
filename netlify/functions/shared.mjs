import { getStore } from "@netlify/blobs";
import { createHmac, timingSafeEqual } from "node:crypto";
const defaults = [
  { id: "p1", name: "Produit 1", price: 50, description: "Découvrez notre produit de qualité, adapté aux besoins de nos clients.", image: "css/images/produit1.png" },
  { id: "p2", name: "Produit 2", price: 75, description: "Un produit pratique et fiable proposé par KWETU COMPANY.", image: "css/images/produit2.png" },
  { id: "p3", name: "Produit 3", price: 100, description: "Un article de qualité destiné à satisfaire nos clients.", image: "produit3.png" },
  { id: "p4", name: "Produit 4", price: 120, description: "Découvrez ce produit parmi nos différentes marchandises.", image: "css/images/produit4.png" }
];
const defaultArticles = [
  { id: "a1", title: "Découvrez nos nouveaux produits", category: "Nouveautés", excerpt: "KWETU COMPANY vous présente ses nouveaux produits disponibles.", content: "Nous sommes heureux de vous présenter notre nouvelle sélection de produits. Chaque article est choisi avec attention afin de répondre aux besoins de nos clients.\n\nPour connaître la disponibilité ou obtenir un conseil personnalisé, contactez directement notre équipe.", image: "css/images/produit1.png", publishedAt: "2026-08-11T08:00:00.000Z" },
  { id: "a2", title: "Profitez de nos promotions", category: "Promotion", excerpt: "Découvrez nos offres promotionnelles à des prix intéressants.", content: "Nos promotions vous permettent de profiter de produits sélectionnés à des conditions avantageuses.\n\nContactez-nous sur WhatsApp pour confirmer les articles concernés et leur disponibilité.", image: "css/images/produit2.png", publishedAt: "2026-08-10T08:00:00.000Z" },
  { id: "a3", title: "Conseils pour bien choisir vos produits", category: "Conseils", excerpt: "Quelques repères simples pour choisir selon vos besoins.", content: "Avant toute commande, identifiez votre besoin principal, comparez les caractéristiques utiles et demandez conseil si nécessaire.\n\nNotre équipe vous aide à faire un choix simple et adapté.", image: "produit3.png", publishedAt: "2026-08-08T08:00:00.000Z" }
];
export const products = () => getStore({ name: "kwetu-products", consistency: "strong" });
export const articles = () => getStore({ name: "kwetu-articles", consistency: "strong" });
export const images = () => getStore("kwetu-images");
export async function listProducts() { const store = products(); return (await store.get("catalog", { type: "json" })) || defaults; }
export async function saveProducts(items) { await products().setJSON("catalog", items); }
export async function listArticles() { const items = (await articles().get("items", { type: "json" })) || defaultArticles; return items.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); }
export async function saveArticles(items) { await articles().setJSON("items", items); }
const secret = () => process.env.ADMIN_TOKEN_SECRET || "";
export function authenticate(request) { const token = request.headers.get("authorization")?.replace("Bearer ", "") || ""; const [body, sig] = token.split("."); if (!body || !sig || !secret()) return false; const expected = createHmac("sha256", secret()).update(body).digest("base64url"); if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false; try { return JSON.parse(Buffer.from(body, "base64url").toString()).exp > Date.now(); } catch { return false; } }
export function token() { const body = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url"); return body + "." + createHmac("sha256", secret()).update(body).digest("base64url"); }
export const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });
