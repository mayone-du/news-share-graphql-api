import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { News } from "nexus-prisma";

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
    t.field(News.id);
    t.nullable.string(News.url.name);
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
        // TODO: IDがBase64でencodeされてるのでbigintにdecode
        const decodedId = args.input.id;
        // urlがundefinedやnullの場合は更新せず、それ以外の場合は更新する
        const url = args.input.url ?? undefined;

        return await ctx.prisma.news.update({
          where: { id: decodedId },
          data: { url },
        });
      },
    });
  },
});
