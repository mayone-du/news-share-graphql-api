import { PrismaClient } from "@prisma/client";
import type { ExpressContext } from "apollo-server/node_modules/apollo-server-express/src/ApolloServer";

import { validateToken } from "./auth/validateToken";
import type { UserInfo } from "./types";

export type Context = {
  prisma: PrismaClient;
  userInfo: UserInfo;
};

const prisma = new PrismaClient();

// TODO: token rotation
// https://api.slack.com/authentication/config-tokens#rotating
export const context = async (ctx: ExpressContext): Promise<Context> => {
  try {
    const authorization = ctx.req.headers.authorization || "";
    if (!authorization) return { prisma, userInfo: { isAuthenticated: false } }; // 認証情報がない場合
    // TODO: token verify
    const { payload } = validateToken(authorization);
    const oauthUserId = payload.sub;
    const user = await prisma.user.findUnique({
      where: { oauthUserId },
    });

    return {
      prisma,
      userInfo: {
        isAuthenticated: true,
        user,
        payload,
      },
    };
  } catch (e) {
    console.error(e);
    return { prisma, userInfo: { isAuthenticated: false, error: e } };
  }
};
