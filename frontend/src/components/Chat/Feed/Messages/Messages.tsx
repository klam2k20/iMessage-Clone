import messageOperations from '@/src/graphql/operations/message';
import { MessagesResponse, MessageSubscriptionResponse, MessagesVariables } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import MessageItem from './MessageItem';
import differenceInHours from 'date-fns/differenceInHours';
import { MessagesSkeleton } from '@/src/components/Common/SkeletonLoader';

interface IMessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<IMessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<MessagesResponse, MessagesVariables>(
    messageOperations.Queries.messages,
    {
      variables: {
        conversationId,
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    }
  );

  const subscribeToNewMessages = (conversationId: string) =>
    subscribeToMore({
      document: messageOperations.Subscriptions.messageSent,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionResponse) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;
        return Object.assign({}, prev, {
          messages:
            userId === newMessage.sender.id ? prev.messages : [newMessage, ...prev.messages],
        });
      },
    });

  useEffect(() => {
    /**
     * SubscribeToMore returns a function that you can use to unsubcribe
     * Unsubcribe after unmount
     */
    const unsubscribe = subscribeToNewMessages(conversationId);
    return () => unsubscribe();
  }, [conversationId]);

  return (
    <Flex
      flexDirection="column-reverse"
      overflowY="scroll"
      sx={{
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      h="100%"
      px={4}
      gap={1}>
      {loading && <MessagesSkeleton />}
      {data?.messages &&
        data.messages.map((m, i) => (
          <MessageItem
            key={m.id}
            message={m}
            sentByMe={m.sender.id === userId}
            hasAvatar={i === 0 || m.sender.id !== data.messages[i - 1].sender.id}
            hasUsername={
              i === data.messages.length - 1 || m.sender.id !== data.messages[i + 1].sender.id
            }
            hasDateTime={
              i === data.messages.length - 1 ||
              differenceInHours(new Date(m.createdAt), new Date(data.messages[i + 1].createdAt)) >=
                1
            }
          />
        ))}
    </Flex>
  );
};

export default Messages;
