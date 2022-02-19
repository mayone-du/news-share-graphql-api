import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { User } from "nexus-prisma";

import { CROWN_EMOJI } from "../../constants/statusEmoji";
import { getSlackUserStatus } from "../../feature/slack";
import { userObject } from "../";
import { unauthorized } from "../errors/messages";

const updateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition: (t) => {
    t.nonNull.field(User.id);
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
        const slackUserStatus = await getSlackUserStatus(
          ctx.userContext.token,
          ctx.userContext.slackAuthTestResponse.user_id ?? "",
        );
        // 初回サインインの場合
        if (!ctx.userContext.user)
          return await ctx.prisma.user.create({
            data: {
              oauthUserId: ctx.userContext.slackAuthTestResponse.user_id,
              username: slackUserStatus.profile?.email ?? "",
              email: slackUserStatus.profile?.email ?? "",
              displayName: slackUserStatus.profile?.display_name ?? "",
              selfIntroduction: slackUserStatus.profile?.status_text ?? "",
              role: slackUserStatus.profile?.status_emoji === CROWN_EMOJI ? "ADMIN" : "USER",
            },
          });

        // 初回ではない場合は、ユーザー情報を更新
        return await ctx.prisma.user.update({
          where: { oauthUserId: ctx.userContext.user.oauthUserId },
          data: {
            displayName: slackUserStatus.profile?.display_name ?? "",
            signInCount: ctx.userContext.user.signInCount + 1,
          },
        });
      },
    });

    t.field("updateUser", {
      type: userObject,
      args: { input: nonNull(arg({ type: updateUserInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        return await ctx.prisma.user.update({
          where: { oauthUserId: ctx.userContext.user.oauthUserId },
          data: {
            displayName: args.input.displayName ?? ctx.userContext.user.displayName,
            selfIntroduction: args.input.selfIntroduction ?? ctx.userContext.user.selfIntroduction,
          },
        });
      },
    });
  },
});
