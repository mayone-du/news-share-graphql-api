import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { WebClient } from "@slack/web-api";
import type { ExpressContext } from "apollo-server-express";
import { verify } from "jsonwebtoken";

import { DEV_SLACK_ENV_VARS } from "./constants/envs";

const slackWebClient = new WebClient();

export type Context = {
  prisma: PrismaClient;
  user?: Pick<User, "id">;
};

const prisma = new PrismaClient();

export const context = async (ctx: ExpressContext): Promise<Context> => {
  const authorization = ctx.req.headers.authorization || "";

  // console.log(authorization);
  // if (!authorization) return { prisma, isAuthenticated: false };
  try {
    const token = await verify(
      authorization.replace("Bearer ", ""),
      DEV_SLACK_ENV_VARS.DEV_SLACK_SIGN_IN_SECRET,
    ).toString();
    const result = slackWebClient.auth.test({ token });
    console.log(result);
    return { prisma, user: { id: 1n } };
  } catch (e) {
    // console.error(e);
    console.error("error");
    return { prisma };
  }
};
