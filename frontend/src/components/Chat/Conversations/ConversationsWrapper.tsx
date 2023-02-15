import { ParticipantPopulated } from '@/../backend/src/util/types';
import messageOperations from '@/src/graphql/operations/message';
import {
  ConversationDeletedSubscriptionResponse,
  ConversationsResponse,
  ConversationSubscriptionResponse,
  ConversationUpdatedSubscriptionResponse,
  MarkConversationAsReadResponse,
  MarkConversationAsReadVariables,
  MessagesResponse,
} from '@/src/util/types';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import conversationOperations from '../../../graphql/operations/conversation';
import ConversationList from './ConversationList';

interface IConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({ session }) => {
  const router = useRouter();
  const {
    user: { id: userId },
  } = session;
  const { conversationId } = router.query;

  const {
    data: conversationData,
    loading,
    error,
    subscribeToMore,
  } = useQuery<ConversationsResponse>(conversationOperations.Queries.conversations);

  const subscribeToNewConversation = () =>
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
  const [
    markConversationAsRead,
    { data, loading: markConversationAsReadLoading, error: markConversationAsReadError },
  ] = useMutation<MarkConversationAsReadResponse, MarkConversationAsReadVariables>(
    conversationOperations.Mutations.markConversationAsRead
  );

  useSubscription<ConversationUpdatedSubscriptionResponse>(
    conversationOperations.Subscriptions.conversationUpdated,
    {
      /**
       * Apollo client uses the conversation Id to udpate the
       * cache under the hood
       */
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        if (!subscriptionData) return;

        /**
         * Update hasSeenLatestMessage to true if the conversation
         * updated is the conversation selected. The backend automatically
         * sets hasSeenLatestMessage to false when sending a new message
         */
        const {
          conversationUpdated: { conversation, addedParticipantIds, deletedParticipantIds },
        } = subscriptionData;
        const isSelectedConversation = conversation.id === conversationId;

        if (
          addedParticipantIds &&
          addedParticipantIds.length &&
          addedParticipantIds.includes(userId)
        ) {
          const existingConversations = client.readQuery<ConversationsResponse>({
            query: conversationOperations.Queries.conversations,
          });
          if (!existingConversations) return;

          client.writeQuery<ConversationsResponse>({
            query: conversationOperations.Queries.conversations,
            data: {
              conversations: [...existingConversations.conversations, conversation],
            },
          });
          return;
        }

        if (
          deletedParticipantIds &&
          deletedParticipantIds.length &&
          deletedParticipantIds.includes(userId)
        ) {
          const existingConversations = client.readQuery<ConversationsResponse>({
            query: conversationOperations.Queries.conversations,
          });
          if (!existingConversations) return;

          const filteredConversations = existingConversations.conversations.filter(
            c => c.id !== conversation.id
          );

          client.writeQuery<ConversationsResponse>({
            query: conversationOperations.Queries.conversations,
            data: {
              conversations: filteredConversations,
            },
          });
          if (isSelectedConversation) router.push('/');
          return;
        }

        if (isSelectedConversation) {
          onViewConversation(conversationId as string, false);
          return;
        }

        /**
         * Update Messages Query. The useQuery is only run once during
         * the initial render. The Messages Query is updated when you are
         * chatting with a selected conversation. However, if you
         * are talking to someone else and get an update that message won't update
         * the query since the subscribeToNewMessages only subscribes to a specific
         * conversation
         */

        /**
         * Get the cached messages for Messages query for the newly
         * updated conversation
         */
        const existingMessages = client.readQuery<MessagesResponse>({
          query: messageOperations.Queries.messages,
          variables: { conversationId: conversation.id },
        });

        /**
         * If the cached messages doesn't contain the new message
         * - which it won't if the user was talking to someone else when
         * the notification comes in - write the latest message to the
         * Messages query cache
         */
        if (!existingMessages) return;
        const hasLatestMessage = existingMessages.messages.find(
          m => m.id === conversation.latestMessage.id
        );

        if (!hasLatestMessage) {
          client.writeQuery<MessagesResponse>({
            query: messageOperations.Queries.messages,
            variables: { conversationId: conversation.id },
            data: {
              ...existingMessages,
              messages: [conversation.latestMessage, ...existingMessages.messages],
            },
          });
        }
      },
    }
  );

  useSubscription<ConversationDeletedSubscriptionResponse>(
    conversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        if (!subscriptionData) return;

        const {
          conversationDeleted: { id: conversationId },
        } = subscriptionData;

        const existingConversations = client.readQuery<ConversationsResponse>({
          query: conversationOperations.Queries.conversations,
        });
        if (!existingConversations) return;
        const { conversations } = existingConversations;
        client.writeQuery<ConversationsResponse>({
          query: conversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(c => c.id !== conversationId),
          },
        });
      },
    }
  );

  const onViewConversation = async (conversationId: string, hasSeenLatestMessage: boolean) => {
    router.push({ query: { conversationId } });

    /**
     * Mark conversation as read and use optimistic rendering
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
            const userParticipant = participants[i];
            participants[i] = {
              ...userParticipant,
              hasSeenLatestMessage: true,
            };

            /**
             * Update cache
             */
            cache.writeFragment({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment UpdatedParticipants on Conversation {
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
      minW={{ base: '100%', md: '400px' }}
      maxW={{ base: '100%', md: '400px' }}
      bg="whiteAlpha.50"
      p={4}>
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
