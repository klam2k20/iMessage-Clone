import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { json } from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { getSession } from "next-auth/react";
import { WebSocketServer } from 'ws';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import { GraphQLContext, Session, SubscriptionContext } from './util/types';


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
  const httpServer = createServer(app);

  /** Resolver Context */
  const prisma = new PrismaClient();
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const pubsub = new PubSub();

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql/subscriptions',
  });

  // WebSocketServer start listening.
  const serverCleanup = useServer({
    schema,
    context: async (cxt: SubscriptionContext): Promise<GraphQLContext> => {
      if (cxt.connectionParams && cxt.connectionParams.session) {
        const { session } = cxt.connectionParams;
        return { session, prisma, pubsub };
      }
      return { session: null, prisma, pubsub };
    }
  }, wsServer);

  const server = new ApolloServer({
    schema: schema,
    csrfPrevention: true,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  const corsOption = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOption),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        /**
         * Create a context that contains the current session
         * info and the prisma client to interact with the DB
         */
        const session = await getSession({ req }) as Session;
        return { session, prisma, pubsub };
      },
    }),
  );
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log('🚀 Server ready at http://localhost:4000/graphql');
}

startApolloServer().catch(error => console.log(error))