import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { User } from "nexus-prisma";

import { userObject } from "../";
import { unauthorized } from "../errors/messages";

const authUserInput = inputObjectType({
  name: "AuthUserInput",
  definition: (t) => {
    t.nonNull.field(User.username);
    t.nonNull.field(User.nickname);
    t.nonNull.field(User.selfIntroduction);
    t.nonNull.field(User.role);
    t.nonNull.field(User.status);
  },
});

const updateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition: (t) => {
    t.nonNull.field(User.id);
  },
});

export const userMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("authUser", {
      type: userObject,
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated) throw Error(unauthorized);
        // 認証済みだが、ユーザーが存在しない場合(初回ログインの場合)はユーザーを作成
        if (ctx.userContext.isInitialSignIn)
          return await ctx.prisma.user.create({
            data: {
              oauthUserId: ctx.userContext.slackAuthTestResponse.user_id,
              // TODO: Slackのuser_idからユーザーのステータスを取得し、運営であるかなどを判断
            },
          });
        // 初回ではない場合は、ユーザー情報を更新
        return await ctx.prisma.user.update({
          where: { oauthUserId: ctx.userContext.user.oauthUserId },
          data: {
            username: "TODO:",
          },
        });

        // if (!ctx.user) throw Error(unauthorized);
        return;
      },
    });
  },
});
