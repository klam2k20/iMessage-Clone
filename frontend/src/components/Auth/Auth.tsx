import { Button, Stack, Text, Input, Center } from "@chakra-ui/react";
import { Session } from "next-auth";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  const onSubmit = async () => {
    try {
      /**
       * Send update request to GraphQL to update the next-auth
       * user object to include username in the DB. Then call
       * reload session to grab the username in the DB and add
       * it to the next-auth obj
       */
    } catch (error) {
      console.log("onSubmit Error", error);
    }
  };

  return (
    <Center h='100vh'>
      <Stack align='center' spacing='1rem'>
        {session?.user ? (
          <>
            <Text fontSize='3xl'>Create Username</Text>
            <Input
              type='text'
              placeholder='Username...'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button w='100%' onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize='3xl'>iMessage</Text>
            <Button leftIcon={<FcGoogle />} onClick={() => signIn("google")}>
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
