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
        if (!ctx.userInfo.isAuthenticated) throw Error(unauthorized);
        // 認証済みだが、ユーザーが存在しない場合(初回ログインの場合)はユーザーを作成
        const isDeveloper =
          ctx.userInfo.payload.email === DEVELOPER_ICLOUD_EMAIL ||
          ctx.userInfo.payload.email === DEVELOPER_GMAIL;
        // TODO: 運営かどうかの判断(そもそもDBに持つ必要ない？Slackの情報もとにってだけでよいのでは説)
        // const isAdmin = ctx.userInfo.

        // 初回サインインの場合
        if (!ctx.userInfo.user)
          return await ctx.prisma.user.create({
            data: {
              oauthUserId: ctx.userInfo.payload.sub,
              username: "todo",
              email: "todo",
              displayName: "todo",
              selfIntroduction: "",
              photoUrl: "",
              role: isDeveloper ? "DEVELOPER" : "USER",
            },
          });

        // 初回ではない場合は、ユーザー情報を更新
        return await ctx.prisma.user.update({
          where: { id: ctx.userInfo.user.id },
          data: {
            displayName: "",
            photoUrl: "",
            signInCount: ctx.userInfo.user.signInCount + 1,
          },
        });
      },
    });

    t.field("updateMyUserInfo", {
      type: userObject,
      args: { input: nonNull(arg({ type: updateMyUserInfoInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userInfo.isAuthenticated || !ctx.userInfo.user) throw Error(unauthorized);
        return await ctx.prisma.user.update({
          where: { id: ctx.userInfo.user.id },
          data: {
            displayName: args.input.displayName ?? ctx.userInfo.user.displayName,
            selfIntroduction: args.input.selfIntroduction ?? ctx.userInfo.user.selfIntroduction,
          },
        });
      },
    });
  },
});
