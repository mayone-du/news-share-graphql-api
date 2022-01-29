import { arg, extendType, inputObjectType, nonNull } from "nexus";

import { userObject } from "../";

const createUserInput = inputObjectType({
  name: "CreateUserInput",
  definition: (t) => {
    t.nonNull.string("username");
    t.nonNull.string("nickname");
    t.nonNull.email("email");
    t.nonNull.field("role", { type: "Role" });
    t.nonNull.field("status", { type: "Status" });
  },
});

const updateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition: (t) => {
    t.nonNull.string("email");
  },
});

export const userMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // create
    t.field("createUser", {
      type: userObject,
      args: { input: nonNull(arg({ type: createUserInput })) },
      resolve: async (_root, args, ctx, _info) => {
        return await ctx.prisma.user.create({
          data: {
            ...args.input,
          },
        });
      },
    });

    // update
    t.field("updateUser", {
      type: userObject,
      args: { input: nonNull(arg({ type: updateUserInput })) },
      resolve: async (_root, args, ctx) => {
        return await ctx.prisma.user.update({
          where: {
            email: args.input.email,
          },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});
