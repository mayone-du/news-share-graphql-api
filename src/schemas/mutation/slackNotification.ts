import { extendType } from "nexus";

import { slackNotificationObject } from "../object";

export const slackNotificationMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // create
    t.field("createSlackNotification", {
      type: slackNotificationObject,
      resolve: async (_root, _args, ctx, _info) => {
        if (!ctx.isAuthenticated) throw Error("This operation is not allowed");
        return await ctx.prisma.slackNotification.create({ data: { isSent: true } });
      },
    });
  },
});
