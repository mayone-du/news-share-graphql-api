import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { User } from "nexus-prisma";

import { userObject } from "../";
import { unauthorized } from "../errors/messages";

const createUserInput = inputObjectType({
  name: "CreateUserInput",
  definition: (t) => {
    t.nonNull.field(User.username);
    t.nonNull.field(User.nickname);
    t.nonNull.field(User.selfIntroduction);
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
        // if (!ctx.user) throw Error(unauthorized);
        // https://api.slack.com/methods/users.profile.get
        // ↑のAPIからSlackでのステータスを読んで、role enumを変更する
        return await ctx.prisma.user.create({ data: { ...args.input } });
      },
    });

    // update
    t.field("updateUser", {
      type: userObject,
      args: { input: nonNull(arg({ type: updateUserInput })) },
      resolve: async (_root, args, ctx) => {
        // TODO: 自分の認証トークンからIDを割り出してそこから更新
        return await ctx.prisma.user.update({
          where: { email: args.input.email },
          data: { ...args.input },
        });
      },
    });
  },
});
