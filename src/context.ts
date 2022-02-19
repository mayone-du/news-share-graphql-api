import { PrismaClient } from "@prisma/client";
// import { InstallProvider } from "@slack/oauth";
// import { WebClient } from "@slack/web-api";
import type { ExpressContext } from "apollo-server-express";
import axios from "axios";

import type { SlackAuthTestResponse, UserContext } from "./types";

// import { verify } from "jsonwebtoken";

// import { DEV_SLACK_ENV_VARS } from "./constants/envs";

// const installer = new InstallProvider({
//   clientId: DEV_SLACK_ENV_VARS.DEV_SLACK_CLIENT_ID,
//   clientSecret: DEV_SLACK_ENV_VARS.DEV_SLACK_CLIENT_SECRET,
// });
// const slackWebClient = new WebClient();

const SLACK_AUTH_TEST_URL = "https://slack.com/api/auth.test";

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
    const res = await axios.post<SlackAuthTestResponse>(SLACK_AUTH_TEST_URL, undefined, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: authorization,
      },
    });
    // 認証情報が正しいか確認
    const isAuthenticated = res.data.ok;
    // 有効ではなかった場合
    if (!isAuthenticated)
      return { prisma, userContext: { isAuthenticated, error: res.data.error } };

    // 有効だった場合
    const user = await prisma.user.findUnique({
      where: { oauthUserId: res.data.ok ? res.data.user_id : "" },
    });
    // ユーザーが存在しない場合は初回サインイン
    if (user) return { prisma, userContext: { isAuthenticated, isInitialSignIn: false, user } };
    return { prisma, userContext: { isAuthenticated, isInitialSignIn: true } };
  } catch (e) {
    console.error(e);
    return { prisma, userContext: { isAuthenticated: false, error: e } };
  }
};
