import { extendType, nullable } from "nexus";
import { News } from "nexus-prisma";

import { encodeId } from "../../util";
import { getOneDayBetween } from "../../util/date";
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
        const { yesterday, tomorrow } = getOneDayBetween(args.sharedAt);
        // 指定された日付のニュースを取得して返す
        return await ctx.prisma.news.findMany({
          where: {
            sharedAt: {
              gt: yesterday, // より上
              lt: tomorrow, // より下
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      },
    });

    t.nonNull.list.nonNull.field("searchNewsList", {
      type: newsObject,
      args: {
        [News.title.name]: nullable(News.title.type.ofNexusType),
        [News.description.name]: nullable(News.description.type.ofNexusType),
      },
      resolve: async (_root, args, ctx, _info) => {
        return await ctx.prisma.news.findMany({
          where: {
            title: { search: args.title ?? undefined },
            description: { search: args.description ?? undefined },
          },
        });
      },
    });

    t.connectionField("allNews", {
      type: newsObject,
      // TODO: asc, desc
      resolve: async (_root, args, ctx, _info) => {
        // TODO: hasNextPage, hasPreviousPageやカーソルのロジック考える or プラグインとか探す
        const newsList = await ctx.prisma.news.findMany({ orderBy: { createdAt: "desc" } });
        const totalCount = await ctx.prisma.news.count();
        const first = args.first ?? 0;
        if (newsList.length) {
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
        } else {
          return {
            edges: [],
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          };
        }
      },
    });
  },
});
