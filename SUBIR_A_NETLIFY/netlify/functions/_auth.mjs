import crypto from "node:crypto";

export const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  },
  body: JSON.stringify(body)
});

const secret = () => process.env.AUTH_SECRET || process.env.PRIVATE_USER_PASSWORD || "";

const base64url = (input) =>
  Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

const sign = (payload) =>
  crypto.createHmac("sha256", secret()).update(payload).digest("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

export const createToken = (email) => {
  const payload = base64url(JSON.stringify({
    email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7
  }));
  return `${payload}.${sign(payload)}`;
};

const verifyToken = (token) => {
  if (!secret() || !token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  if (!data.email || Date.now() > data.exp) return null;
  return data;
};

export const requireUser = (event) => {
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const data = verifyToken(token);
  const allowed = (process.env.PRIVATE_USER_EMAIL || "").toLowerCase();
  if (!data || data.email.toLowerCase() !== allowed) return null;
  return data;
};
