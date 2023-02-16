import { ApolloProvider } from '@apollo/client';
import { ChakraBaseProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { theme } from '../chakra/theme';
import { client } from '../graphql/apollo-client';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="A Real-time Chat App created with React" />
        <title>iMessage</title>
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <ChakraBaseProvider theme={theme}>
            <Component {...pageProps} />
            <Toaster position="bottom-center" />
          </ChakraBaseProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
