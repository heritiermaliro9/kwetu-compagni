export default async () => Response.json({
  ok: true,
  functions: true,
  adminConfigured: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_ACCESS_KEY && process.env.ADMIN_TOKEN_SECRET)
}, { headers: { "cache-control": "no-store" } });
