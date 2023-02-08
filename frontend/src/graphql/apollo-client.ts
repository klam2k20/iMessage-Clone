import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getSession } from 'next-auth/react';

/**
 * Http Link will be sent all queries and mutations
 */
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

/**
 * Websocket Link will be sent all subscriptions. Since NextJs
 * has sever side rendering before creating the wslink we have to
 * validate that the app is in the browser and not the NextJs socket
 */
const wsLink = typeof window !== "undefined" ? new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql/subscriptions',
  connectionParams: async () => ({
    session: await getSession()
  }),
})) : null;

/**
 * Split link takes the httpLink and wsLink and routes the query to either 
 * the httpLink or wsLink depending on the type of operation
 */
const splitLink = typeof window !== "undefined" && wsLink !== null ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})