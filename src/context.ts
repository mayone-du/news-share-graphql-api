import { PrismaClient } from "@prisma/client";
import type { ExpressContext } from "apollo-server-express";
import { OAuth2Client } from "google-auth-library";

import { GOOGLE_ENV_VARS } from "./constants/envs";

export type Context = {
  prisma: PrismaClient;
  isAuthenticated: boolean;
};

const prisma = new PrismaClient();
const oAuth2Client = new OAuth2Client(
  GOOGLE_ENV_VARS.GOOGLE_CLIENT_ID,
  GOOGLE_ENV_VARS.GOOGLE_CLIENT_SECRET,
  GOOGLE_ENV_VARS.GOOGLE_REDIRECT_URL,
);
export const context = async (ctx: ExpressContext): Promise<Context> => {
  const authorization = ctx.req.headers.authorization || "";
  // console.log(authorization);
  if (!authorization) return { prisma, isAuthenticated: false };
  try {
    const tokenInfo = await oAuth2Client.getTokenInfo(authorization);
    console.log("tokenInfo", tokenInfo);
  } catch (e) {
    // console.error(e);
    return { prisma, isAuthenticated: false };
  }

  return { prisma, isAuthenticated: false };
};
