import { decode } from "jsonwebtoken";

import type { Payload } from "../types";

// TODO: error messageを独自コードとかにしてみたいな？
export const validateToken = (targetToken: string) => {
  const [bearer, token] = targetToken.split(" ");
  if (bearer !== "Bearer") throw Error("Bearer is not found");
  const payload = decode(token);
  if (typeof payload !== "object" || !payload) throw Error("invalid token");
  // TODO: トークンの有効期限を延長する このままだと5分とかしか無理
  // if (payload.exp && payload.exp * 1000 < Date.now()) throw Error("token expired");
  return { payload: payload as Payload };
};
