import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv';
import { getSession } from "next-auth/react";
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { GraphQLContext, Session } from './util/types';


/**
 * A GraphQL schema defines the entity types - a description of the data
 * clients can request from a GraphQL API and operation types - the 
 * queries, mutations, and subscription functions that the client
 * can use to read and write data from the GraphQL server. The main 
 * purpose of having a schema is to make sure our GraphQL API is type safe.
 * Any requests to and any entities being sent to or returned from our API
 * most match a defined entity or operation type
 */
async function startApolloServer() {
  dotenv.config();

  const app = express();
  const httpServer = http.createServer(app);
  const prisma = new PrismaClient();
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const corsOption = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }
  const server = new ApolloServer({
    schema: schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req }): Promise<GraphQLContext> => {
      /**
       * Create a context that contains the current session
       * info and the prisma client to interact with the DB
       */
      const session = await getSession({ req }) as Session;
      return { session, prisma };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  await server.start();
  server.applyMiddleware({ app, cors: corsOption });
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch(error => console.log(error))