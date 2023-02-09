import { ConversationPopulated } from '@/../backend/src/util/types';
import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal/ConversationModal';

interface IConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<IConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const {
    user: { id: userId },
  } = session;
  const router = useRouter();

  return (
    <Box w="100%">
      <Box bg="blackAlpha.300" py={2} px={4} borderRadius="md" cursor="pointer">
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500} onClick={onOpen}>
          Find or Start a Conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {conversations.map(c => (
        <ConversationItem
          key={c.id}
          userId={userId}
          conversation={c}
          onClick={() => onViewConversation(c.id)}
          isSelected={router.query.conversationId === c.id}
        />
      ))}
    </Box>
  );
};

export default ConversationList;
