import { Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { BiMessageSquareDots } from 'react-icons/bi';
import FeedStart from './FeedStart';
import MessageHeader from './Messages/MessageHeader';
import MessageInput from './Messages/MessageInput';
import Messages from './Messages/Messages';

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      w="100%"
      flexDirection="column">
      {conversationId ? (
        <>
          <Flex flexDirection="column" justify="space-between" overflow="hidden" flexGrow={1}>
            <MessageHeader userId={userId} conversationId={conversationId as string} />
            <Messages userId={userId} conversationId={conversationId as string} />
          </Flex>
          <MessageInput session={session} conversationId={conversationId as string} />
        </>
      ) : (
        <FeedStart session={session} />
      )}
    </Flex>
  );
};

export default FeedWrapper;
