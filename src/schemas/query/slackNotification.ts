import { extendType } from "nexus";
import { SlackNotification } from "nexus-prisma";

import { getOneDayBetween } from "../../util/date";
import { slackNotificationObject } from "../object";

export const slackNotificationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("slackNotification", {
      type: slackNotificationObject,
      args: {
        id: SlackNotification.createdAt.type,
      },
      resolve: async (_root, args, ctx, _info) => {
        const { yesterday, tomorrow } = getOneDayBetween(args.createdAt); // TODO: argsに型がついてないの調べる
        return await ctx.prisma.news.findFirst({
          where: {
            createdAt: {
              gt: yesterday, // より上
              lt: tomorrow, // より下
            },
          },
        });
      },
    });
  },
});
