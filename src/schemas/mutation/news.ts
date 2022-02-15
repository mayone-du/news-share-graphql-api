import { arg, extendType, inputObjectType, list, nonNull } from "nexus";
import { News } from "nexus-prisma";

import { decodeId, fetchMetaFields } from "../../util";
import { newsObject } from "../";
import { unauthorized } from "../errors/messages";

const createNewsInput = inputObjectType({
  name: "CreateNewsInput",
  definition: (t) => {
    t.field(News.url);
  },
});

const updateNewsInput = inputObjectType({
  name: "UpdateNewsInput",
  definition: (t) => {
    t.nonNull.id("nodeId");
    t.nullable.string(News.url.name);
    t.nullable.string(News.title.name);
    t.nullable.string(News.description.name);
    t.nullable.datetime(News.sharedAt.name);
  },
});

const postponeNewsListInput = inputObjectType({
  name: "PostponeNewsListInput",
  definition: (t) => {
    // nodeIdの配列を受け取る
    t.nonNull.list.nonNull.id("nodeIds");
    t.nonNull.datetime(News.sharedAt.name);
  },
});

export const newsMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // create
    t.field("createNews", {
      type: newsObject,
      args: { input: nonNull(arg({ type: createNewsInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.user) throw Error(unauthorized);
        // TODO: urlのバリデーション
        const metaFields = fetchMetaFields(args.input.url);
        return await ctx.prisma.news.create({
          data: {
            ...args.input,
            ...metaFields,
            userId: ctx.user.id,
          },
        });
      },
    });

    // update 運営の人しか更新不可
    t.field("updateNews", {
      type: newsObject,
      args: { input: nonNull(arg({ type: updateNewsInput })) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw Error(unauthorized);
        const decodedId = decodeId(args.input.nodeId).databaseId;
        // undefinedやnullの場合は更新せず、それ以外の場合は更新する
        const { input } = args;

        return await ctx.prisma.news.update({
          where: { id: decodedId },
          data: {
            url: input.url ?? undefined,
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            sharedAt: input.sharedAt ?? undefined,
          },
        });
      },
    });

    t.field("postponeNewsList", {
      type: list(newsObject),
      args: { input: nonNull(arg({ type: postponeNewsListInput })) },
      resolve: async (root, args, ctx, _info) => {
        const decodedIds = args.input.nodeIds.map((id) => {
          return decodeId(id).databaseId;
        });
        await ctx.prisma.news.updateMany({
          where: { id: { in: decodedIds } },
          data: { sharedAt: args.input.sharedAt },
        });
        const updatedNewsList = await ctx.prisma.news.findMany({
          where: { id: { in: decodedIds } },
        });
        return updatedNewsList;
      },
    });

    // delete
    t.field("deleteNews", {
      type: newsObject,
      args: { id: nonNull(arg({ type: News.id.type })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.user) throw Error(unauthorized);
        return await ctx.prisma.news.delete({
          where: { id: args.id },
        });
      },
    });
  },
});
