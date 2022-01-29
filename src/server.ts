import { ApolloServer } from "apollo-server";

import { context } from "./context";
import { schema } from "./schema";

const server = new ApolloServer({
  cors: true,
  schema,
  context,
});

server.listen().then(async ({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `);
});
