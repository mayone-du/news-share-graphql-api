import { objectType } from "nexus";
import { News } from "nexus-prisma";

import { encodeId } from "../../util/convert";

export const newsObject = objectType({
  name: News.$name,
  description: News.$description,
  definition: (t) => {
    t.field(News.id);
    t.field(News.title);
    t.field(News.description);
    t.field(News.imageUrl);
    t.field(News.url);
    t.field(News.nickname);
    t.field(News.createdAt);
    t.field(News.updatedAt);
    t.field(News.sharedAt);

    t.field("nodeId", {
      type: "ID",
      resolve(root, _args, _ctx) {
        return encodeId("News", root.id);
      },
    });
  },
});
