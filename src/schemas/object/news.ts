import { objectType } from "nexus";
import { News } from "nexus-prisma";

export const newsObject = objectType({
  name: News.$name,
  description: News.$description,
  definition: (t) => {
    t.field(News.id);
    t.field(News.title);
    t.field(News.description);
    t.field(News.imageUrl);
    t.field(News.nickname);
    t.field(News.createdAt);
    t.field(News.updatedAt);
  },
});
