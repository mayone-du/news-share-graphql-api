import { extendType } from "nexus";

import { postNewsListToSlack } from "../../feature/slack";
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
        // TODO: トランザクションはってもいいかも
        if (!ctx.userInfo.isAuthenticated || ctx.userInfo.user?.role === "USER")
          throw Error(unauthorized);
        try {
          const { yesterday, tomorrow } = getOneDayBetween(new Date());
          const todayViewedNewsList = await ctx.prisma.news.findMany({
            where: { sharedAt: { gt: yesterday, lt: tomorrow }, isViewed: true },
            orderBy: { sharedAt: "asc" },
          });
          const chatPostMessageResponse = await postNewsListToSlack(todayViewedNewsList);
          if (!chatPostMessageResponse?.ok) throw Error(chatPostMessageResponse?.error);
          const slackNotificationRecord = await ctx.prisma.slackNotification.create({
            data: { isSent: chatPostMessageResponse.ok },
          });
          return slackNotificationRecord;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    });
  },
});
