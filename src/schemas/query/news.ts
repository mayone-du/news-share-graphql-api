import { extendType } from "nexus";

import { newsObject } from "../object";

export const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("news", {
      type: newsObject,
      args: {
        id: "BigInt",
      },
      resolve: async (_root, args, ctx, _info) => {
        return await ctx.prisma.news.findFirst({ where: { id: Number(args.id) } });
      },
    });

    t.connectionField("allNews", {
      type: newsObject,
      resolve: async (_root, args, ctx, _info) => {
        const newsList = await ctx.prisma.news.findMany();
        // TODO: いろいろ
        return {
          edges: newsList.map((news) => {
            return { node: news, cursor: news.id.toString() };
          }),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      },
    });
  },
});
