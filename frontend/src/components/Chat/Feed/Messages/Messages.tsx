import messageOperations from '@/src/graphql/operations/message';
import { MessagesResponse, MessageSubscriptionResponse, MessagesVariables } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
          messages: [newMessage, ...prev.messages],
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
    /**
     * Add css to hide scrollbar
     */
    <Flex flexDirection="column-reverse" overflowY="scroll" h="100%">
      {data?.messages && data.messages.map(m => <div key={m.id}>{m.body}</div>)}
    </Flex>
  );
};

export default Messages;
