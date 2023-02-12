import { gql, useMutation, useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import conversationOperations from '../../../graphql/operations/conversation';
import {
  ConversationsResponse,
  ConversationSubscriptionResponse,
  MarkConversationAsReadResponse,
  MarkConversationAsReadVariables,
} from '@/src/util/types';
import { cache, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ConversationsSkeleton } from '../../Common/SkeletonLoader';
import { toast } from 'react-hot-toast';
import { ParticipantPopulated } from '@/../backend/src/util/types';

interface IConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({ session }) => {
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

  const [
    markConversationAsRead,
    { data, loading: markConversationAsReadLoading, error: markConversationAsReadError },
  ] = useMutation<MarkConversationAsReadResponse, MarkConversationAsReadVariables>(
    conversationOperations.Mutations.markConversationAsRead
  );

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;
  const { conversationId } = router.query;
  const onViewConversation = async (conversationId: string, hasSeenLatestMessage: boolean) => {
    router.push({ query: { conversationId } });

    /**
     * Mark conversation as read
     */
    if (!hasSeenLatestMessage)
      try {
        await markConversationAsRead({
          variables: { userId, conversationId },
          optimisticResponse: { markConversationAsRead: true },
          update: cache => {
            /**
             * Find the participant fragment on this specific conversation
             */
            const participantFragment = cache.readFragment<{
              participants: Array<ParticipantPopulated>;
            }>({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment Participants on Conversation {
                  participants {
                    user {
                      id
                      username
                    }
                    hasSeenLatestMessage
                  }
                }
              `,
            });

            /**
             * Update the user specific participant's hasSeenLatestMessage
             * while keeping the remaining participants unchanged
             */
            if (!participantFragment) return;
            const participants = [...participantFragment.participants];
            const i = participants.findIndex(p => p.user.id === userId);
            if (i === -1) return;
            participants[i] = {
              ...participants[i],
              hasSeenLatestMessage: true,
            };

            /**
             * Update cache
             */
            cache.writeFragment({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment Participants on Conversation {
                  participants
                }
              `,
              data: {
                participants,
              },
            });
          },
        });
      } catch (error: any) {
        console.log('onViewConversation Error', error.message);
        toast.error(error.message);
      }
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
