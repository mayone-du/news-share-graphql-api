import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { User } from "nexus-prisma";
import { encodeId } from "../../util";

import { unauthorized } from "../errors/messages";
import { userObject } from "../object";

const userInput = inputObjectType({
  name: "UserInput",
  definition: (t) => {
    t.nonNull.field(User.oauthUserId);
  },
});

export const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: userObject,
      args: { input: arg({ type: nonNull(userInput) }) },
      resolve: async (_root, args, ctx) => {
        return await ctx.prisma.user.findUnique({
          where: { oauthUserId: args.input.oauthUserId },
        });
      },
    });

    t.field("myUserInfo", {
      type: userObject,
      resolve: async (_root, _args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        return await ctx.prisma.user.findUnique({ where: { id: ctx.userContext.user.id } });
      },
    });

    t.connectionField("users", {
      type: userObject,
      resolve: async (_root, args, ctx, _info) => {
        const first = args.first || 0; // TODO: args
        const userList = await ctx.prisma.user.findMany();
        const totalCount = await ctx.prisma.user.count();
        if (userList.length) {
          return {
            edges: userList.map((user) => {
              return {
                node: user,
                cursor: encodeId("User", user.id),
              };
            }),
            totalCount,
            pageInfo: {
              hasNextPage: totalCount > first + userList.length,
              hasPreviousPage: false, // TODO
              startCursor: encodeId("User", userList[0].id),
              endCursor: encodeId("User", userList[userList.length - 1].id),
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

    // TODO: connection field
    // t.field("users", {
    //   type: userObject,
    //   resolve: (_root, args, ctx) => {
    //     return ctx.prisma.user.findMany();
    //   },
    // });

    // t.connectionField("users", {
    //   type: userObject,
    //   resolve: async (_root, args, ctx) => {
    //     const result = await ctx.prisma.user.findMany({
    //       where: {
    //         id: Number(args.id),
    //       },
    //     });
    //     return result;
    //   },
    // });
  },
});
