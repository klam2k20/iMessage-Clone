import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';
import http from 'http';

/**
 * A GraphQL schema defines the entity types - a description of the data
 * clients can request from a GraphQL API and operation types - the 
 * queries, mutations, and subscription functions that the client
 * can use to read and write data from the GraphQL server. The main 
 * purpose of having a schema is to make sure our GraphQL API is type safe.
 * Any requests to and any entities being sent to or returned from our API
 * most match a defined entity or operation type
 * @param typeDefs defines the entity types
 * @param resolvers defines the operation types
 */
async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch(error => console.log(error))