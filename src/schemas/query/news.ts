import dayjs from "dayjs";
import { extendType } from "nexus";
import { arg } from "nexus";
import { News } from "nexus-prisma";

import { encodeId } from "../../util";
import { sortOrder } from "../enum";
import { newsObject } from "../object";

export const newsQuery = extendType({
  // TODO: nodeIdを受け取ってidを返すようにする
  type: "Query",
  definition(t) {
    t.field("news", {
      type: newsObject,
      args: {
        id: News.id.type,
      },
      resolve: async (_root, args, ctx, _info) => {
        return await ctx.prisma.news.findUnique({ where: { id: args.id } });
      },
    });

    t.nonNull.list.nonNull.field("newsList", {
      type: newsObject,
      args: {
        [News.sharedAt.name]: News.sharedAt.type,
      },
      resolve: async (_root, args, ctx, _info) => {
        // JSTではなくUTCで扱っているため注意
        const date = dayjs(dayjs(args.sharedAt).format("YYYY-MM-DD"));
        const tomorrow = date.add(1, "day").toDate();
        const yesterday = date.toDate();

        // 指定された日付のニュースを取得して返す
        return await ctx.prisma.news.findMany({
          where: {
            sharedAt: {
              gt: yesterday, // より上
              lt: tomorrow, // より下
            },
          },
        });
      },
    });

    t.connectionField("allNews", {
      type: newsObject,
      // TODO: asc, desc
      additionalArgs: {
        orderBy: arg({ type: sortOrder, default: "asc" }),
      },
      resolve: async (_root, args, ctx, _info) => {
        // TODO: hasNextPage, hasPreviousPageやカーソルのロジック考える or プラグインとか探す
        const newsList = await ctx.prisma.news.findMany();
        const totalCount = await ctx.prisma.news.count();
        const first = args.first ?? 0;
        return {
          edges: newsList.map((news) => {
            return {
              node: news,
              cursor: encodeId("News", news.id),
            };
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
