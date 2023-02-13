import { ConversationPopulated, ParticipantPopulated } from '@/../backend/src/util/types';
import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ConversationsSkeleton } from '../../Common/SkeletonLoader';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal/ConversationModal';

interface IConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean) => void;
  loading: boolean;
}

const ConversationList: React.FC<IConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const {
    user: { id: userId },
  } = session;
  const router = useRouter();

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
  );

  return (
    <Box w="100%">
      <Box bg="blackAlpha.300" py={2} px={4} borderRadius="md" cursor="pointer" mb={4}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500} onClick={onOpen}>
          Find or Start a Conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      {loading && <ConversationsSkeleton />}
      {sortedConversations.map(c => {
        const participant = c.participants.find((p: ParticipantPopulated) => p.user.id === userId);
        return (
          <ConversationItem
            key={c.id}
            userId={userId}
            conversation={c}
            onClick={() => onViewConversation(c.id, c.hasSeenLatestMessage)}
            isSelected={router.query.conversationId === c.id}
            hasSeenLatestMessage={participant.hasSeenLatestMessage}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
