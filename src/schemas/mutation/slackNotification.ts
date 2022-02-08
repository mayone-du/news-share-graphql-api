import { extendType } from "nexus";

import { slackNotificationObject } from "../object";

export const slackNotificationMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // create
    t.field("createSlackNotification", {
      type: slackNotificationObject,
      // TODO: ここでctxかinfoに詰めた認証情報を確認して、認証済みユーザー(slack通知が許可されているユーザー)でなければエラーを返す
      resolve: async (_root, _args, ctx, _info) => {
        return await ctx.prisma.slackNotification.create({ data: {} });
      },
    });
  },
});
