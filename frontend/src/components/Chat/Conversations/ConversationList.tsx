import { ConversationPopulated, ParticipantPopulated } from '@/src/util/types';
import conversationOperations from '@/src/graphql/operations/conversation';
import {
  DeleteConversationResponse,
  DeleteConversationVariables,
  UpdateConversationParticipantsResponse,
  UpdateConversationParticipantsVariables,
} from '@/src/util/types';
import { useMutation } from '@apollo/client';
import { Box, Button, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
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
  const {
    user: { id: userId },
  } = session;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editConversation, setEditConversation] = useState<ConversationPopulated | null>();
  const onOpen = () => setIsOpen(true);

  /** Mutations */
  const [deleteConversation] = useMutation<DeleteConversationResponse, DeleteConversationVariables>(
    conversationOperations.Mutations.deleteConversation
  );

  const [updateConversationParticipants] = useMutation<
    UpdateConversationParticipantsResponse,
    UpdateConversationParticipantsVariables
  >(conversationOperations.Mutations.updateConversationParticipants);

  /** Sort conversation in descending updatedAt order */
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
  );

  /** Handle user leaving a conversation */
  const onLeaveConversation = async (conversation: ConversationPopulated) => {
    const filteredParticipantIds = conversation.participants
      .filter(p => p.user.id !== userId)
      .map(p => p.user.id);
    try {
      await updateConversationParticipants({
        variables: {
          conversationId: conversation.id,
          participantIds: filteredParticipantIds,
        },
      });
    } catch (error: any) {
      console.log('onLeaveConversation Error', error.message);
      toast.error(error.message);
    }
  };

  /** Handle user deleting a conversation */
  const onDeleteConversation = (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: { conversationId },
          update: () => {
            router.push('/');
          },
        }),
        {
          loading: 'Deleting Conversation',
          success: 'Conversation Deleted',
          error: 'Failed to Delete Conversation',
        }
      );
    } catch (error: any) {
      console.log('deleteConversation Error', error.message);
    }
  };

  /** Logout and redirect user to origin */
  const logout = () => {
    signOut({ callbackUrl: `${window.location.origin}` });
  };

  return (
    <Box w="100%" h="100%" position="relative">
      <Box bg="blackAlpha.300" py={2} px={4} borderRadius="md" cursor="pointer">
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500} onClick={onOpen}>
          Find or Start a Conversation
        </Text>
      </Box>
      <ConversationModal
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setEditConversation={setEditConversation}
        conversations={conversations}
        onViewConversation={onViewConversation}
        editConversation={editConversation}
      />
      <Box
        h="90%"
        my={4}
        overflowY="scroll"
        sx={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
        {loading ? (
          <ConversationsSkeleton />
        ) : (
          sortedConversations.map(c => {
            const participant = c.participants.find(
              (p: ParticipantPopulated) => p.user.id === userId
            );
            return (
              <ConversationItem
                key={c.id}
                userId={userId}
                conversation={c}
                onClick={() => onViewConversation(c.id, c.hasSeenLatestMessage)}
                isSelected={router.query.conversationId === c.id}
                hasSeenLatestMessage={participant.hasSeenLatestMessage}
                onDeleteConversation={() => onDeleteConversation(c.id)}
                onEditConversation={() => setEditConversation(c)}
                onLeaveConversation={() => onLeaveConversation(c)}
              />
            );
          })
        )}
      </Box>
      <Button
        w="100%"
        bg="#1f1f1f"
        _hover={{ bg: '#1f1f1f' }}
        position="absolute"
        bottom={2}
        zIndex={1}
        onClick={logout}>
        Logout
      </Button>
    </Box>
  );
};

export default ConversationList;
