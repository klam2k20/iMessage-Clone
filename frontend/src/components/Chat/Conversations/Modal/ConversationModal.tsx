import { ConversationPopulated, ParticipantPopulated } from '@/src/util/types';
import { areParticipantsEqual, findUserParticipant } from '@/src/util/functions';
import {
  CreateConversationResponse,
  CreateConversationVariables,
  SearchedUser,
  SearchUserResponse,
  SearchUserVariables,
  UpdateConversationParticipantsResponse,
  UpdateConversationParticipantsVariables,
} from '@/src/util/types';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import conversationOperations from '../../../../graphql/operations/conversation';
import userOperations from '../../../../graphql/operations/user';
import ConversationItem from '../ConversationItem';
import ParticipantList from './ParticipantList';
import SearchedUserList from './SearchedUserList';

interface IConversationModalProps {
  session: Session;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  setEditConversation?: (state: ConversationPopulated | null) => void;
  conversations: Array<ConversationPopulated>;
  onViewConversation?: (conversationId: string, hasSeenLatestMessage: boolean) => void;
  editConversation?: ConversationPopulated | null;
}

const ConversationModal: React.FC<IConversationModalProps> = ({
  session,
  isOpen,
  setIsOpen,
  setEditConversation,
  conversations,
  onViewConversation,
  editConversation,
}) => {
  const router = useRouter();
  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [existingConversation, setExistingConversation] = useState<ConversationPopulated | null>();

  /** Queries */
  let [searchUser, { data, loading }] = useLazyQuery<SearchUserResponse, SearchUserVariables>(
    userOperations.Queries.searchUsers
  );

  /** Mutation */
  const [createConversation, { loading: createConversationLoading }] = useMutation<
    CreateConversationResponse,
    CreateConversationVariables
  >(conversationOperations.Mutations.createConversation);

  const [updateConversationParticipants, { loading: updateConversationLoading }] = useMutation<
    UpdateConversationParticipantsResponse,
    UpdateConversationParticipantsVariables
  >(conversationOperations.Mutations.updateConversationParticipants);

  /** Determine if an existing conversation with these participants exist */
  const findExistingConversation = (participantIds: string[]) => {
    const potentialMatchingConversations = conversations.filter(
      c => c.participants.length === participantIds.length
    );

    const conversation = potentialMatchingConversations.find(c =>
      c.participants.reduce(
        (acc: boolean, p: ParticipantPopulated) => acc && participantIds.includes(p.user.id),
        true
      )
    );

    if (conversation) setExistingConversation(conversation);
    return conversation;
  };

  /** Reset conversation modal*/
  const onClose = () => {
    setIsOpen(false);
    setUsername('');
    setParticipants([]);
    setExistingConversation(null);
    if (setEditConversation) setEditConversation(null);
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    searchUser({ variables: { username } });
  };

  const onCreateConversation = async () => {
    if (participants.length >= 1) {
      const participantIds = [userId, ...participants.map(p => p.id)];
      if (findExistingConversation(participantIds)) return;

      try {
        const { data: conversation } = await createConversation({
          variables: { participants: participantIds },
        });
        if (!conversation?.createConversation) throw new Error('Error Creating Conversation');
        const {
          createConversation: { conversationId },
        } = conversation;
        router.push({ query: { conversationId } });
        onClose();
      } catch (error: any) {
        console.log('onCreateConversation Error', error.message);
        toast.error(error.message);
      }
    }
  };

  const onUpdateConversation = async () => {
    const participantIds = [userId, ...participants.map(p => p.id)];
    if (findExistingConversation(participantIds)) return;

    if (editConversation) {
      try {
        const participantIds = [...participants.map(p => p.id), userId];
        await updateConversationParticipants({
          variables: { conversationId: editConversation.id, participantIds },
        });
        onClose();
      } catch (error: any) {
        console.log('onUpdateConversation Error', error.message);
        toast.error(error.message);
      }
    }
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants(pre => [...pre, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants(pre => pre.filter(p => p.id !== userId));
  };

  /**
   * If a conversation with the listed participants exist
   * display a conversation item that when clicked will
   * redirect the user to the existing conversation
   */
  const onExistingConversation = () => {
    if (existingConversation) {
      const userParticipant = findUserParticipant(userId, existingConversation.participants);
      if (userParticipant) {
        onClose();
        if (onViewConversation)
          onViewConversation(existingConversation.id, userParticipant.hasSeenLatestMessage);
      }
    }
  };

  /**
   * When participants are added or removed check
   * that the conversation that we are editing (if any)
   * participants don't match the currently selected
   * participants. If it does update existing conversation
   * to the current conversation else set it to null
   */
  useEffect(() => {
    const isEqual = areParticipantsEqual(
      [userId, ...participants.map(p => p.id)],
      editConversation?.participants.map(p => p.user.id) || []
    );
    if (isEqual) setExistingConversation(editConversation);
    else {
      setExistingConversation(null);
    }
  }, [participants]);

  /**
   * If we are editing a conversation update the modal's
   * participants
   */
  useEffect(() => {
    if (editConversation) {
      const conversationParticipants = editConversation.participants
        .filter((p: ParticipantPopulated) => p.user.id !== userId)
        .map((p: ParticipantPopulated) => p.user as SearchedUser);
      setParticipants(conversationParticipants);
      setIsOpen(true);
    }
  }, [editConversation]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent bg="#1f1f1f" pb={4}>
          <ModalHeader>Create Converation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <Button type="submit" isDisabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <SearchedUserList
                users={data.searchUsers}
                participants={participants}
                addParticipant={addParticipant}
              />
            )}
            {participants.length > 0 && (
              <ParticipantList participants={participants} removeParticipant={removeParticipant} />
            )}
            {existingConversation && (
              <Box pt={4}>
                <ConversationItem
                  userId={userId}
                  conversation={existingConversation}
                  onClick={onExistingConversation}
                  isSelected={false}
                  hasSeenLatestMessage={true}
                  onDeleteConversation={() => {}}
                  onEditConversation={() => {}}
                  onLeaveConversation={() => {}}
                />
              </Box>
            )}
            <Button
              mt={4}
              w="100%"
              cursor="pointer"
              bg="brand.100"
              _hover={{ bg: 'brand.100' }}
              onClick={editConversation ? onUpdateConversation : onCreateConversation}
              isDisabled={!!existingConversation || participants.length == 0}
              isLoading={editConversation ? updateConversationLoading : createConversationLoading}>
              {editConversation ? 'Update Conversation' : 'Create Conversation'}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
