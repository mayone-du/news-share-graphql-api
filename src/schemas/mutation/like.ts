import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { Like } from "nexus-prisma";

import { likeObject } from "../";
import { unauthorized } from "../errors/messages";

const toggleLikeInput = inputObjectType({
  name: "ToggleLikeInput",
  definition: (t) => {
    t.nonNull.field(Like.newsId);
    t.nonNull.field(Like.isLiked);
  },
});

export const likeMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("toggleLike", {
      type: likeObject,
      args: { input: nonNull(arg({ type: toggleLikeInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        const likeRecord = await ctx.prisma.like.findFirst({
          where: {
            newsId: args.input.newsId,
            userId: ctx.userContext.user.id,
          },
        });
        // レコードがすでに存在すればupdate
        if (likeRecord) {
          const updatedLikeRecord = await ctx.prisma.like.update({
            where: { id: likeRecord.id },
            data: { isLiked: args.input.isLiked },
          });
          return updatedLikeRecord;
        } else {
          const createdLikeRecord = await ctx.prisma.like.create({
            data: {
              newsId: args.input.newsId,
              userId: ctx.userContext.user.id,
              isLiked: args.input.isLiked,
            },
          });
          return createdLikeRecord;
        }
      },
    });

    t.field("createLike", {
      type: likeObject,
      args: { input: nonNull(arg({ type: toggleLikeInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        const likeRecord = await ctx.prisma.like.create({
          data: { isLiked: true, newsId: args.input.newsId, userId: ctx.userContext.user.id },
        });
        return likeRecord;
      },
    });

    t.field("updateLike", {
      type: likeObject,
      args: { input: nonNull(arg({ type: toggleLikeInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        const likeRecord = await ctx.prisma.like.update({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          where: { newsId_userId: { newsId: args.input.newsId, userId: ctx.userContext.user.id } },
          data: { isLiked: !args.input.isLiked },
        });
        return likeRecord;
      },
    });
  },
});
