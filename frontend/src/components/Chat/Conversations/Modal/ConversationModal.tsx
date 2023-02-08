import {
  CreateConversationResponse,
  CreateConversationVariables,
  SearchedUser,
  SearchUserResponse,
  SearchUserVariables,
} from '@/src/util/types';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  Stack,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import userOperations from '../../../../graphql/operations/user';
import conversationOperations from '../../../../graphql/operations/conversation';
import ParticipantList from './ParticipantList';
import SearchedUserList from './SearchedUserList';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface IConversationModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<IConversationModalProps> = ({ session, isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  let [searchUser, { data, loading, error }] = useLazyQuery<
    SearchUserResponse,
    SearchUserVariables
  >(userOperations.Queries.searchUsers);
  const [createConversation, { loading: createConversationLoading }] = useMutation<
    CreateConversationResponse,
    CreateConversationVariables
  >(conversationOperations.Mutations.createConversation);
  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    searchUser({ variables: { username } });
  };

  const onCreateConversation = async () => {
    if (participants.length >= 1) {
      const participantIds = [userId, ...participants.map(p => p.id)];
      try {
        const { data: conversation } = await createConversation({
          variables: { participants: participantIds },
        });

        if (!conversation?.createConversation) throw new Error('Error Creating Conversation');

        const {
          createConversation: { conversationId },
        } = conversation;
        router.push({ query: { conversationId } });

        /**
         * Clear conversation modal
         */
        setUsername('');
        setParticipants([]);
        onClose();
      } catch (error: any) {
        console.log('onCreateConversation Error', error.message);
        toast.error(error.message);
      }
    }
  };

  const addParticipant = (user: SearchedUser) => {
    if (!participants.some(p => p.id === user.id)) {
      setParticipants(pre => [...pre, user]);
      setUsername('');
    }
  };

  const removeParticipant = (userId: string) => {
    setParticipants(pre => pre.filter(p => p.id !== userId));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="2d2d2d" pb={4}>
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
            {username && data?.searchUsers && (
              <SearchedUserList users={data.searchUsers} addParticipant={addParticipant} />
            )}
            {participants.length > 0 && (
              <ParticipantList participants={participants} removeParticipant={removeParticipant} />
            )}
            <Button
              mt={4}
              w="100%"
              cursor="pointer"
              bg="brand.100"
              _hover={{ bg: 'brand.100' }}
              onClick={onCreateConversation}
              isLoading={createConversationLoading}>
              Create Conversation
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
