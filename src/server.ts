import { ApolloServer } from "apollo-server";

import { context } from "./context";
import { schema } from "./schema";

const server = new ApolloServer({
  cors: {
    origin: "*", // TODO: 自動化 Develop only
    // origin: "https://news-share-web.vercel.app",
  },
  schema,
  context,
});

server.listen({ port: process.env.PORT || 4000 }).then(async ({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `);
});
