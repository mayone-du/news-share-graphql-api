import { extendType } from "nexus";

import { getOneDayBetween } from "../../util/date";
import { unauthorized } from "../errors/messages";
import { slackNotificationObject } from "../object";

export const slackNotificationMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // create
    t.field("createSlackNotification", {
      type: slackNotificationObject,
      resolve: async (_root, _args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated) throw Error(unauthorized);
        const record = await ctx.prisma.slackNotification.create({ data: { isSent: true } });
        const { yesterday, tomorrow } = getOneDayBetween(record.createdAt);

        const todayNewsList = await ctx.prisma.news.findMany({
          where: { sharedAt: { gt: yesterday, lt: tomorrow } },
          orderBy: { sharedAt: "asc" },
        });
        const slackPayload = {};
        // TODO: SlackのBlock Kitでいい感じに表示

        // record.isSent && (await handleSubmitSlack(slackPayload));
        return record;
      },
    });
  },
});
