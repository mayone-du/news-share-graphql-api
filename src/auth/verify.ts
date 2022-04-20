import { decode } from "jsonwebtoken";

import type { Payload } from "../types";

// TODO: error messageを独自コードとかにしてみたいな？
export const verify = (
  targetToken: string,
): { ok: true; payload: Payload } | { ok: false; error: unknown } => {
  try {
    const [bearer, token] = targetToken.split(" ");
    if (bearer !== "Bearer") throw Error("Bearer is not found");
    const payload = decode(token);
    if (typeof payload !== "object" || !payload) throw Error("invalid token");
    if (payload.exp && payload.exp * 1000 < Date.now()) throw Error("token expired");
    return { ok: true, payload };
  } catch (error) {
    return { ok: false, error };
  }
};
