import { Box } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Auth from "../components/Auth/Auth";
import Chat from "../components/Chat/Chat";

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <Box>
      {session?.user.username ? (
        <Chat />
      ) : (
        <Auth session={session} reloadSession={() => {}} />
      )}
    </Box>
  );
};

/**
 * To use server- side rendering you need to export getServerSideProps.
 * getServerSideProps runs per request and inside the
 * function you can fetch external session and send it as props to the
 * page component. In this case when the homepage is requested,
 * on the server the session will be fetched and given to the home page.
 * So the page can render right away instead of getting the session itself
 * @param context Because getServerSideProps is called at request time its parameter
 * (context) contains request specific parameters
 * @returns returns the user session
 */
export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

export default Home;
