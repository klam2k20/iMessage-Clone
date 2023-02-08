import { Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;
  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      w="100%"
      flexDirection="column">
      {conversationId ? <Flex>{conversationId}</Flex> : <Text>No Conversation Selected</Text>}
    </Flex>
  );
};

export default FeedWrapper;
