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
    t.nonNull.id("id");
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
        return await ctx.prisma.news.update({
          where: {},
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});
