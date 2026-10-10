import { getStore } from "@netlify/blobs";
import { json, requireUser } from "./_auth.mjs";

const keyFor = (email) => `workspace-${email.toLowerCase().replace(/[^a-z0-9._-]/g, "_")}.json`;

export const handler = async (event) => {
  const user = requireUser(event);
  if (!user) return json(401, { error: "No autorizado." });

  const store = getStore("private-workspace");
  const key = keyFor(user.email);

  if (event.httpMethod === "GET") {
    const data = await store.get(key, { type: "json", consistency: "strong" });
    return json(200, { state: data || null });
  }

  if (event.httpMethod === "PUT") {
    const body = JSON.parse(event.body || "{}");
    if (!body.state || body.state.schema !== "junta-asuncion-v1") return json(400, { error: "Estado invalido." });
    await store.setJSON(key, body.state, {
      metadata: { email: user.email, updatedAt: new Date().toISOString() }
    });
    return json(200, { ok: true });
  }

  return json(405, { error: "Metodo no permitido." });
};
