import { GraphQLEnumType } from "graphql";
import { GraphQLBigInt, GraphQLDateTime, GraphQLEmailAddress } from "graphql-scalars";
import { asNexusMethod, connectionPlugin, makeSchema } from "nexus";

import * as allTypes from "./schemas";

export const schema = makeSchema({
  types: [
    allTypes,
    asNexusMethod(GraphQLBigInt, "bigint", "bigint"),
    asNexusMethod(GraphQLDateTime, "datetime", "datetime"),
    asNexusMethod(GraphQLEmailAddress, "email", "email"),
    GraphQLEnumType,
  ],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
  plugins: [connectionPlugin()],
});
