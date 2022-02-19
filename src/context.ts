import { PrismaClient } from "@prisma/client";
import { App as SlackApp } from "@slack/bolt";
import type { ExpressContext } from "apollo-server-express";

import { DEV_SLACK_ENV_VARS } from "./constants/envs";
import type { UserContext } from "./types";

const slackApp = new SlackApp({
  signingSecret: DEV_SLACK_ENV_VARS.DEV_SLACK_SIGN_IN_SECRET,
  token: DEV_SLACK_ENV_VARS.DEV_SLACK_BOT_OAUTH_TOKEN,
});

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
    const authRes = await slackApp.client.auth.test({ token });
    const slackUserStatus = await slackApp.client.users.profile.get({
      token,
      user: authRes.user_id,
    });
    // console.log(authRes, slackUserStatus);
    // 認証情報が正しいか確認
    const isAuthenticated = authRes.ok;
    // 有効ではなかった場合
    if (!isAuthenticated) return { prisma, userContext: { isAuthenticated, error: authRes.error } };

    // 有効だった場合
    const user = await prisma.user.findUnique({
      where: { oauthUserId: authRes.ok ? authRes.user_id : "" },
    });
    if (user)
      return {
        prisma,
        userContext: {
          isAuthenticated,
          isInitialSignIn: false,
          user,
          slackAuthTestResponse: authRes,
        },
      };
    // ユーザーが存在しない場合は初回サインイン
    return {
      prisma,
      userContext: { isAuthenticated, isInitialSignIn: true, slackAuthTestResponse: authRes },
    };
  } catch (e) {
    console.error(e);
    return { prisma, userContext: { isAuthenticated: false, error: e } };
  }
};
