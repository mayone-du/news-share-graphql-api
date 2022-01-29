import { PrismaClient } from "@prisma/client";
import type { ExpressContext } from "apollo-server-express";
import { OAuth2Client } from "google-auth-library";

import { GOOGLE_ENV_VARS } from "./constants/envs";

export type Context = {
  prisma: PrismaClient;
};

const prisma = new PrismaClient();
const oAuth2Client = new OAuth2Client(
  GOOGLE_ENV_VARS.GOOGLE_CLIENT_ID,
  GOOGLE_ENV_VARS.GOOGLE_CLIENT_SECRET,
  GOOGLE_ENV_VARS.GOOGLE_REDIRECT_URL,
);
export const context = async (ctx: ExpressContext) => {
  const authorization = ctx.req.headers.authorization || "";
  // const tokenInfo = oAuth2Client.getTokenInfo(ctx.req.headers.authorization ?? "");

  // eslint-disable-next-line no-console
  // console.log(tokenInfo);
  // if (!tokenInfo) throw Error("No Token");
  return { prisma };
};
