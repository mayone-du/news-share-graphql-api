import dayjs from "dayjs";
import { arg, extendType, inputObjectType, list, nonNull } from "nexus";
import { News } from "nexus-prisma";

import { fetchMetaFields } from "../../feature/scraping";
import { decodeId } from "../../util";
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
    t.nullable.string(News.sharedAt.name);
    t.nullable.boolean(News.isViewed.name);
    t.nullable.boolean(News.isImportant.name);
  },
});

const postponeNewsListInput = inputObjectType({
  name: "PostponeNewsListInput",
  definition: (t) => {
    // nodeIdの配列を受け取る
    t.nonNull.list.nonNull.id("nodeIds");
    t.nonNull.string(News.sharedAt.name); // DateTimeではなくStringで扱う
  },
});

const deleteNewsInput = inputObjectType({
  name: "DeleteNewsInput",
  definition: (t) => {
    t.nonNull.id("nodeId");
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
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        // TODO: urlのバリデーション
        // TODO: ogpが存在しない場合にtitleタグやdescriptionタグが取得できない
        try {
          const metaFields = await fetchMetaFields(args.input.url);
          return await ctx.prisma.news.create({
            data: {
              ...args.input,
              ...metaFields,
              userId: ctx.userContext.user.id,
            },
          });
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    });

    // update 運営の人しか更新不可
    t.field("updateNews", {
      type: newsObject,
      args: { input: nonNull(arg({ type: updateNewsInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        const decodedId = decodeId(args.input.nodeId).databaseId;
        // 自分のニュースかチェック
        const news = await ctx.prisma.news.findUnique({
          where: { id: decodedId },
        });
        // リクエストを送ったユーザーとニュースの作成者が違い、かつ、運営や開発者でない場合はエラー
        if (ctx.userContext.user.id !== news?.userId && ctx.userContext.user.role === "USER")
          throw Error(unauthorized);
        // undefinedやnullの場合は更新せず、それ以外の場合は更新する
        const { input } = args;
        // 引数でシェアする日時が指定され、かつ指定されたニュースが今日のものでなければエラー (過去のニュースとかは延期させたくない)
        if (
          input.sharedAt &&
          dayjs().format("YYYY-MM-DD") !== dayjs(news?.sharedAt).format("YYYY-MM-DD")
        )
          throw Error("invalid date");
        // ニュースの作成者と運営のみ編集可能
        return await ctx.prisma.news.update({
          where: { id: decodedId },
          data: {
            url: input.url ?? undefined,
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            sharedAt: input.sharedAt ? new Date(input.sharedAt) : undefined,
            isViewed: input.isViewed ?? undefined,
            isImportant: input.isImportant ?? undefined,
          },
        });
      },
    });

    // ニュースを一括延期
    t.field("postponeNewsList", {
      type: list(newsObject),
      args: { input: nonNull(arg({ type: postponeNewsListInput })) },
      resolve: async (_root, args, ctx, _info) => {
        const decodedIds = args.input.nodeIds.map((id) => {
          return decodeId(id).databaseId;
        });
        await ctx.prisma.news.updateMany({
          where: { id: { in: decodedIds } },
          data: { sharedAt: new Date(args.input.sharedAt) },
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
      args: { input: nonNull(arg({ type: deleteNewsInput })) },
      resolve: async (_root, args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        const decodedId = decodeId(args.input.nodeId).databaseId;
        // 自分のニュースかチェック
        const news = await ctx.prisma.news.findUnique({
          where: { id: decodedId },
        });
        // リクエストを送ったユーザーとニュースの作成者が違い、かつ、運営や開発者でない場合はエラー
        if (ctx.userContext.user.id !== news?.userId && ctx.userContext.user.role === "USER")
          throw Error(unauthorized);

        const deleteNews = await ctx.prisma.news.findUnique({
          where: { id: decodedId },
        });
        if (!deleteNews) throw Error("News Not Found");
        await ctx.prisma.news.delete({
          where: { id: decodedId },
        });
        return deleteNews;
      },
    });
  },
});
