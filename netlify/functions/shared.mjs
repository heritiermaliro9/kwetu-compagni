import { getStore } from "@netlify/blobs";
import { createHmac, timingSafeEqual } from "node:crypto";
const defaults = [
  { id: "p1", name: "Produit 1", price: 50, description: "Découvrez notre produit de qualité, adapté aux besoins de nos clients.", image: "css/images/produit1.png" },
  { id: "p2", name: "Produit 2", price: 75, description: "Un produit pratique et fiable proposé par KWETU COMPANY.", image: "css/images/produit2.png" },
  { id: "p3", name: "Produit 3", price: 100, description: "Un article de qualité destiné à satisfaire nos clients.", image: "produit3.png" },
  { id: "p4", name: "Produit 4", price: 120, description: "Découvrez ce produit parmi nos différentes marchandises.", image: "css/images/produit4.png" }
];
export const products = () => getStore({ name: "kwetu-products", consistency: "strong" });
export const images = () => getStore("kwetu-images");
export async function listProducts() { const store = products(); return (await store.get("catalog", { type: "json" })) || defaults; }
export async function saveProducts(items) { await products().setJSON("catalog", items); }
const secret = () => process.env.ADMIN_TOKEN_SECRET || "";
export function authenticate(request) { const token = request.headers.get("authorization")?.replace("Bearer ", "") || ""; const [body, sig] = token.split("."); if (!body || !sig || !secret()) return false; const expected = createHmac("sha256", secret()).update(body).digest("base64url"); if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false; try { return JSON.parse(Buffer.from(body, "base64url").toString()).exp > Date.now(); } catch { return false; } }
export function token() { const body = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url"); return body + "." + createHmac("sha256", secret()).update(body).digest("base64url"); }
export const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });
