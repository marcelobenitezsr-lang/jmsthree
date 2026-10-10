import { createToken, json } from "./_auth.mjs";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Metodo no permitido." });

  const configuredEmail = (process.env.PRIVATE_USER_EMAIL || "").toLowerCase();
  const configuredPassword = process.env.PRIVATE_USER_PASSWORD || "";

  if (!configuredEmail || !configuredPassword || !process.env.AUTH_SECRET) {
    return json(500, { error: "Faltan variables PRIVATE_USER_EMAIL, PRIVATE_USER_PASSWORD o AUTH_SECRET en Netlify." });
  }

  try {
    const { email, password } = JSON.parse(event.body || "{}");
    if (String(email || "").toLowerCase() !== configuredEmail || String(password || "") !== configuredPassword) {
      return json(401, { error: "Usuario o clave incorrectos." });
    }

    return json(200, { token: createToken(configuredEmail), email: configuredEmail });
  } catch {
    return json(400, { error: "Solicitud invalida." });
  }
};
