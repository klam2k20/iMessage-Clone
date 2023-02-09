import { Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import MessageHeader from './Messages/MessageHeader';

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
        <Flex flexDirection="column" justify="space-between" flexGrow={1}>
          <MessageHeader userId={userId} conversationId={conversationId as string} />
        </Flex>
      ) : (
        <Text>No Conversation Selected</Text>
      )}
    </Flex>
  );
};

export default FeedWrapper;
