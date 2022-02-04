import { extendType } from "nexus";

import { slackNotificationObject } from "../object";

export const slackNotificationMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // create
    t.field("createSlackNotification", {
      type: slackNotificationObject,
      resolve: async (_root, _args, ctx, _info) => {
        return await ctx.prisma.slackNotification.create({ data: {} });
      },
    });
  },
});
