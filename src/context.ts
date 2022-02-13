import { PrismaClient } from "@prisma/client";
import { WebClient } from "@slack/web-api";
import type { ExpressContext } from "apollo-server-express";
import { verify } from "jsonwebtoken";

import { DEV_SLACK_ENV_VARS } from "./constants/envs";

const slackWebClient = new WebClient();

export type Context = {
  prisma: PrismaClient;
  isAuthenticated: boolean;
};

const prisma = new PrismaClient();

export const context = async (ctx: ExpressContext): Promise<Context> => {
  console.log("call");
  const authorization = ctx.req.headers.authorization || "";

  // console.log(authorization);
  // if (!authorization) return { prisma, isAuthenticated: false };
  try {
    const token = await verify(
      authorization.replace("Bearer ", ""),
      DEV_SLACK_ENV_VARS.DEV_SLACK_SIGN_IN_SECRET,
    );
    const result = slackWebClient.auth.test({ token });
    console.log(result);
  } catch (e) {
    // console.error(e);
    return { prisma, isAuthenticated: false };
  }

  return { prisma, isAuthenticated: false };
};
