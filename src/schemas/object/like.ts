import { objectType } from "nexus";
import { Like } from "nexus-prisma";

export const likeObject = objectType({
  name: Like.$name,
  description: Like.$description,
  definition: (t) => {
    t.field(Like.id);
    t.field(Like.user);
    t.field(Like.news);
    t.field(Like.createdAt);
    t.field(Like.updatedAt);
    t.field(Like.isLiked);
    t.field(Like.updatedAt);
  },
});
