import { extendType } from "nexus";

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
        return await ctx.prisma.user.findFirst({ where: { id: Number(args.id) } });
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
