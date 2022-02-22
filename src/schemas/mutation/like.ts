import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { Like } from "nexus-prisma";

import { userObject } from "../";
import { unauthorized } from "../errors/messages";

const createLikeInput = inputObjectType({
  name: "CreateLikeInput",
  definition: (t) => {
    t.nonNull.field(Like.newsId);
  },
});

export const likeMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("createLike", {
      type: userObject,
      args: { input: nonNull(arg({ type: createLikeInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        const likeRecord = await ctx.prisma.like.create({
          data: { isLiked: true, newsId: args.input.newsId, userId: ctx.userContext.user.id },
        });
        return likeRecord;
      },
    });
  },
});
