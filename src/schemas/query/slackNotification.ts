import { extendType } from "nexus";

// import { SlackNotification } from "nexus-prisma";
import { getOneDayBetween } from "../../util/date";
import { slackNotificationObject } from "../object";

export const slackNotificationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("slackNotification", {
      type: slackNotificationObject,
      resolve: async (_root, _args, ctx, _info) => {
        const { yesterday, tomorrow } = getOneDayBetween(new Date());
        return await ctx.prisma.slackNotification.findFirst({
          where: {
            createdAt: {
              gt: yesterday,
              lt: tomorrow,
            },
          },
        });
      },
    });
  },
});
