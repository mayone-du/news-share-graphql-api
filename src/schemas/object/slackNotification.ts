import { objectType } from "nexus";
import { SlackNotification } from "nexus-prisma";

export const slackNotificationObject = objectType({
  name: SlackNotification.$name,
  description: SlackNotification.$description,
  definition: (t) => {
    t.field(SlackNotification.id);
    t.field(SlackNotification.isSent);
    t.field(SlackNotification.createdAt);
    t.field(SlackNotification.updatedAt);
  },
});
