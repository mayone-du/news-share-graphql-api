import { extendType } from "nexus";

export const testQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("test", {
      type: "String",
      // args: { customArg: "Boolean" }, // OK
      // args: { customArg: "EmailAddress" }, // OK
      // args: { customArg: "DateTime" }, // Error!🐛
      args: { customArg: "String" }, // OK
      resolve: async (_root, args, _ctx, _info) => {
        return await `args is ${args.customArg}`;
      },
    });
  },
});
