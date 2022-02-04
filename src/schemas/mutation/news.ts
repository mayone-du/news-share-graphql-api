import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { News } from "nexus-prisma";

import { decodeId } from "../../util/convert";
import { newsObject } from "../";

const createNewsInput = inputObjectType({
  name: "CreateNewsInput",
  definition: (t) => {
    t.field(News.url);
    t.field(News.nickname);
  },
});

const updateNewsInput = inputObjectType({
  name: "UpdateNewsInput",
  definition: (t) => {
    t.nonNull.id(News.id.name);
    t.nullable.string(News.url.name);
    t.nullable.string(News.title.name);
    t.nullable.string(News.description.name);
    t.nullable.string(News.nickname.name);
    t.nullable.datetime(News.sharedAt.name);
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
        return await ctx.prisma.news.create({
          // TODO: スクレイピング
          data: {
            ...args.input,
            title: "",
            description: "",
            imageUrl: "",
          },
        });
      },
    });

    // update
    t.field("updateNews", {
      type: newsObject,
      args: { input: nonNull(arg({ type: updateNewsInput })) },
      resolve: async (_root, args, ctx) => {
        const decodedId = decodeId(args.input.id).databaseId;
        // urlがundefinedやnullの場合は更新せず、それ以外の場合は更新する
        const { input } = args;

        return await ctx.prisma.news.update({
          where: { id: decodedId },
          data: {
            url: input.url ?? undefined,
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            nickname: input.nickname ?? undefined,
            sharedAt: input.sharedAt ?? undefined,
          },
        });
      },
    });
  },
});
