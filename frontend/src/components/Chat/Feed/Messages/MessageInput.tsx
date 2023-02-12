import { Box, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { cache, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import messageOperations from '@/src/graphql/operations/message';
import {
  MessagesResponse,
  SendMessageResponse,
  SendMessageVariables,
} from '../../../../util/types';
import ObjectID from 'bson-objectid';
interface IMessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<IMessageInputProps> = ({ session, conversationId }) => {
  const [message, setMessage] = useState('');
  const [sendMessage, { loading }] = useMutation<SendMessageResponse, SendMessageVariables>(
    messageOperations.Mutations.sendMessage
  );

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        user: { id: senderId },
      } = session;
      const id = new ObjectID().toString();
      setMessage('');
      const { data, errors } = await sendMessage({
        variables: { id, senderId, conversationId, body: message },
        optimisticResponse: { sendMessage: true },
        update: cache => {
          const existingCache = cache.readQuery<MessagesResponse>({
            query: messageOperations.Queries.messages,
            variables: { conversationId },
          }) as MessagesResponse;
          cache.writeQuery<MessagesResponse, { conversationId: string }>({
            query: messageOperations.Queries.messages,
            variables: { conversationId },
            data: {
              ...existingCache,
              messages: [
                {
                  id,
                  sender: {
                    id: senderId,
                    username: session.user.username,
                  },
                  body: message,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                ...existingCache.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error('Failed to Send Message');
      }
    } catch (error: any) {
      console.log('onSendMessage Error', error.meesage);
      toast.error(error.message);
    }
  };

  return (
    <Box mt={2} py={2} px={4} w="100%">
      <form onSubmit={onSendMessage}>
        <Input
          type="text"
          placeholder="iMessage"
          value={message}
          onChange={e => setMessage(e.target.value)}
          _focus={{
            bowShadow: 'none',
            border: '1px solid',
            borderColor: 'whiteAlpha.500',
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
