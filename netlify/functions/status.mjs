const required = ["ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_ACCESS_KEY", "ADMIN_TOKEN_SECRET"];
export default async () => {
  const missing = required.filter(name => !process.env[name]);
  return Response.json({ ok: true, functions: true, adminConfigured: missing.length === 0, missing }, { headers: { "cache-control": "no-store" } });
};
