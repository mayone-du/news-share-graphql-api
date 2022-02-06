import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { User } from "nexus-prisma";

import { userObject } from "../";

const createUserInput = inputObjectType({
  name: "CreateUserInput",
  definition: (t) => {
    t.nonNull.field(User.username);
    t.nonNull.field(User.nickname);
    t.nonNull.field(User.email);
    t.nonNull.field(User.role);
    t.nonNull.field(User.status);
  },
});

const updateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition: (t) => {
    t.nonNull.field(User.id);
    t.nonNull.field(User.email);
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
        return await ctx.prisma.user.create({ data: { ...args.input } });
      },
    });

    // update
    t.field("updateUser", {
      type: userObject,
      args: { input: nonNull(arg({ type: updateUserInput })) },
      resolve: async (_root, args, ctx) => {
        return await ctx.prisma.user.update({
          where: { email: args.input.email },
          data: { ...args.input },
        });
      },
    });
  },
});
