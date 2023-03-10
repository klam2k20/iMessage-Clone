import userOperations from '@/src/graphql/operations/user';
import { CreateUsernameResponse, CreateUsernameVariables } from '@/src/util/types';
import { useMutation } from '@apollo/client';
import { Button, Center, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState('');

  /** Mutation */
  const [createUsername, { loading }] = useMutation<
    CreateUsernameResponse,
    CreateUsernameVariables
  >(userOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (username) {
      try {
        const { data } = await createUsername({ variables: { username } });
        if (!data?.createUsername) throw new Error();
        if (data?.createUsername.error) throw new Error(data?.createUsername.error);
        toast.success(`Welcome ${username}`);
        reloadSession();
      } catch (error: any) {
        toast.error(error.message);
        console.log('onSubmit Error', error.message);
      }
    }
  };

  return (
    <Center h="100vh">
      <Stack align="center" spacing="1rem">
        {session ? (
          <form onSubmit={onSubmit}>
            <Stack align="center" spacing="1rem">
              <Text fontSize="3xl">Create Username</Text>
              <Input
                type="text"
                placeholder="Username..."
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Button w="100%" type="submit" isLoading={loading}>
                Save
              </Button>
            </Stack>
          </form>
        ) : (
          <>
            <Text fontSize="3xl">iMessage</Text>
            <Button leftIcon={<FcGoogle />} onClick={() => signIn('google')}>
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
