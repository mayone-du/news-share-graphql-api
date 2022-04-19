import { PrismaClient } from "@prisma/client";
import type { ExpressContext } from "apollo-server/node_modules/apollo-server-express/src/ApolloServer";
import { decode } from "jsonwebtoken";

import type { Payload, UserContext } from "./types";

export type Context = {
  prisma: PrismaClient;
  userContext: UserContext;
};

const prisma = new PrismaClient();

// TODO: token rotation
// https://api.slack.com/authentication/config-tokens#rotating
export const context = async (ctx: ExpressContext): Promise<Context> => {
  try {
    const authorization = ctx.req.headers.authorization || "";
    console.log("authorization:", authorization);
    if (!authorization) return { prisma, userContext: { isAuthenticated: false } }; // 認証情報がない場合
    // TODO: token verify
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") return { prisma, userContext: { isAuthenticated: false } }; // 認証情報が不正な場合
    const payload = decode(token);
    // TODO: リファクタ
    // const tokenPayload: TokenPayload = payload as { sub: string };
    if (typeof payload !== "object" || !payload)
      return { prisma, userContext: { isAuthenticated: false } }; // 認証情報がない場合
    if (payload.exp && payload.exp * 1000 < Date.now())
      return { prisma, userContext: { isAuthenticated: false, error: "token expired" } }; // 認証情報が期限切れの場合

    const oauthUserId = typeof payload.sub === "string" ? payload.sub : "";
    // console.log("oauthUserId:", oauthUserId);
    // 有効だった場合
    const user = await prisma.user.findUnique({
      where: { oauthUserId },
    });

    return {
      prisma,
      userContext: {
        isAuthenticated: true,
        user,
        payload: payload as Payload,
      },
    };
  } catch (e) {
    console.error(e);
    return { prisma, userContext: { isAuthenticated: false, error: e } };
  }
};
