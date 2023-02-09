import { Box, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface IMessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<IMessageInputProps> = ({ session, conversationId }) => {
  const [message, setMessage] = useState('');

  const onSendMessage = async () => {
    try {
      // Message Mutation
    } catch (error: any) {
      console.log('onSendMessage Error', error.meesage);
      toast.error(error.message);
    }
  };

  return (
    <Box py={2} px={4} w="100%">
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
