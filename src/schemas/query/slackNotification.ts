import { arg, extendType, nonNull } from "nexus";

// import { SlackNotification } from "nexus-prisma";
import { getOneDayBetween } from "../../util/date";
import { slackNotificationObject } from "../object";

export const slackNotificationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("slackNotification", {
      type: slackNotificationObject,
      args: {
        // createdAt: SlackNotification.createdAt.type,
        // フロントのバグ(graphql-code-generator)のせいでDateTimeが引数に使えないため
        createdAt: arg({ type: nonNull("String") }),
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
