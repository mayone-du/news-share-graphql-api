import { extendType } from "nexus";

import { unauthorized } from "../errors/messages";
import { userObject } from "../object";

export const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: userObject,
      args: {
        id: "BigInt",
      },
      resolve: async (_root, args, ctx) => {
        return await ctx.prisma.user.findUnique({ where: { id: Number(args.id) } });
      },
    });

    t.field("myUserInfo", {
      type: userObject,
      resolve: async (_root, _args, ctx, _info) => {
        if (!ctx.userContext.isAuthenticated || !ctx.userContext.user) throw Error(unauthorized);
        return await ctx.prisma.user.findUnique({ where: { id: ctx.userContext.user.id } });
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
