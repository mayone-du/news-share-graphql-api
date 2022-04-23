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
        const slackUserStatus = await getSlackUserStatus(ctx.userInfo.payload.sub);
        const isAdmin = slackUserStatus.profile?.status_emoji === CROWN_EMOJI;
        if (!slackUserStatus.ok) throw Error("");
        const email = slackUserStatus.profile?.email ?? ctx.userInfo.payload.email;

        // 初回サインインの場合
        if (!ctx.userInfo.user)
          return await ctx.prisma.user.create({
            data: {
              oauthUserId: ctx.userInfo.payload.sub,
              username: slackUserStatus.profile?.real_name ?? email,
              email,
              displayName: slackUserStatus.profile?.display_name ?? ctx.userInfo.payload.given_name,
              selfIntroduction: "",
              photoUrl: slackUserStatus.profile?.image_192 ?? ctx.userInfo.payload.picture,
              role: isDeveloper ? "DEVELOPER" : isAdmin ? "ADMIN" : "USER",
            },
          });

        // 初回ではない場合は、ユーザー情報を更新
        return await ctx.prisma.user.update({
          where: { id: ctx.userInfo.user.id },
          data: {
            displayName: slackUserStatus.profile?.display_name ?? ctx.userInfo.payload.name,
            photoUrl: ctx.userInfo.payload.picture,
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
