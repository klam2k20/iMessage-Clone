import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import conversationOperations from '../../../graphql/operations/conversation';
import { ConversationsResponse, ConversationSubscriptionResponse } from '@/src/util/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ConversationsSkeleton } from '../../Common/SkeletonLoader';

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
    subscribeToMore,
  } = useQuery<ConversationsResponse>(conversationOperations.Queries.conversations);

  const subscribeToNewConversation = () => {
    subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, { subscriptionData }: ConversationSubscriptionResponse) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  const router = useRouter();
  const { conversationId } = router.query;
  const onViewConversation = (conversationId: string) => {
    router.push({ query: { conversationId } });
  };

  useEffect(() => {
    subscribeToNewConversation();
  }, []);

  return (
    <Box
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
      w={{ base: '100%', md: '400px' }}
      bg="whiteAlpha.50"
      py={8}
      px={4}>
      <ConversationList
        session={session}
        conversations={conversationData?.conversations || []}
        onViewConversation={onViewConversation}
        loading={loading}
      />
    </Box>
  );
};

export default ConversationWrapper;
