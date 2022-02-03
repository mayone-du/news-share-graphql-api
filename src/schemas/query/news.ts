import { extendType } from "nexus";

import { encodeId } from "../../util/convert";
import { newsObject } from "../object";

export const newsQuery = extendType({
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
        // TODO: hasNextPage, hasPreviousPageやカーソルのロジック考える or プラグインとか探す
        const newsList = await ctx.prisma.news.findMany();
        const totalCount = await ctx.prisma.news.count();
        const first = args.first ?? 0;
        return {
          edges: newsList.map((news) => {
            return { node: news, cursor: news.id.toString() };
          }),
          totalCount,
          pageInfo: {
            hasNextPage: totalCount > first + newsList.length,
            hasPreviousPage: false,
            startCursor: encodeId("News", newsList[0].id),
            endCursor: encodeId("News", newsList[newsList.length - 1].id),
          },
        };
      },
    });
  },
});
