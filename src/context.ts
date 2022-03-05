import { PrismaClient } from "@prisma/client";
import type { ExpressContext } from "apollo-server/node_modules/apollo-server-express/src/ApolloServer";

import { slackAuthTest } from "./feature/slack";
import type { UserContext } from "./types";

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
    if (!authorization) return { prisma, userContext: { isAuthenticated: false } }; // 認証情報がない場合
    const token = authorization.replace("Bearer ", "");
    const authRes = await slackAuthTest(token);
    // 認証情報が正しいか確認
    const isAuthenticated = authRes.ok;
    // 有効ではなかった場合
    if (!isAuthenticated) {
      console.error(`Slackの権限: ${authRes.response_metadata?.scopes?.join(",")}`);
      console.error(`エラーメッセージ: ${authRes.response_metadata?.messages}`);
      console.error(authRes.error);
      return { prisma, userContext: { isAuthenticated, error: authRes.error } };
    }

    // 有効だった場合
    const user = await prisma.user.findUnique({
      where: { oauthUserId: authRes.ok ? authRes.user_id : "" },
    });
    return {
      prisma,
      userContext: {
        isAuthenticated,
        user,
        slackAuthTestResponse: { user_id: authRes.user_id ?? "" },
        token,
      },
    };
  } catch (e) {
    console.error("Unexpected Error in Context: ", e);
    return { prisma, userContext: { isAuthenticated: false, error: e } };
  }
};
