import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { User } from "nexus-prisma";

import { DEVELOPER_GMAIL, DEVELOPER_ICLOUD_EMAIL } from "../../constants/email";
import { CROWN_EMOJI } from "../../constants/statusEmoji";
import { getSlackUserStatus } from "../../feature/slack";
import { userObject } from "../";
import { unauthorized } from "../errors/messages";

const updateMyUserInfoInput = inputObjectType({
  name: "UpdateMyUserInfoInput",
  definition: (t) => {
    t.nullable.field(User.displayName);
    t.nullable.field(User.selfIntroduction);
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
        // const isDeveloper =
        //   slackUserStatus.profile?.email === DEVELOPER_ICLOUD_EMAIL ||
        //   slackUserStatus.profile?.email === DEVELOPER_GMAIL;
        // 初回サインインの場合
        if (!ctx.userContext.user)
          return await ctx.prisma.user.create({
            data: {
              oauthUserId: ctx.userContext.tokenPayload.sub,
              username: "todo",
              email: "todo",
              displayName: "todo",
              selfIntroduction: "",
              photoUrl: "",
            },
          });

        // 初回ではない場合は、ユーザー情報を更新
        return await ctx.prisma.user.update({
          where: { id: ctx.userContext.user.id },
          data: {
            displayName: "",
            photoUrl: "",
            signInCount: ctx.userContext.user.signInCount + 1,
          },
        });
      },
    });

    t.field("updateMyUserInfo", {
      type: userObject,
      args: { input: nonNull(arg({ type: updateMyUserInfoInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        return await ctx.prisma.user.update({
          where: { id: ctx.userContext.user.id },
          data: {
            displayName: args.input.displayName ?? ctx.userContext.user.displayName,
            selfIntroduction: args.input.selfIntroduction ?? ctx.userContext.user.selfIntroduction,
          },
        });
      },
    });
  },
});
