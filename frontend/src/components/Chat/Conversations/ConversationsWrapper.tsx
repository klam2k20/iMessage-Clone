import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import conversationOperations from '../../../graphql/operations/conversation';
import { ConversationsResponse } from '@/src/util/types';

interface IConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({ session }) => {
  /**
   * Add useQuery type
   */
  const {
    data: conversationData,
    loading,
    error,
  } = useQuery<ConversationsResponse>(conversationOperations.Queries.conversations);

  return (
    <Box w={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={8} px={4}>
      <ConversationList session={session} conversations={conversationData?.conversations || []} />
    </Box>
  );
};

export default ConversationWrapper;
