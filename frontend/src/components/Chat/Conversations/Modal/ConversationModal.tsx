import { SearchUserResponse, SearchUserVariables } from "@/src/util/types";
import { useLazyQuery } from "@apollo/client";
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
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import userOperations from "../../../../graphql/operations/user";
import SearchedUserList from "./SearchedUserList";

interface IConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<IConversationModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [searchUser, { data, loading, error }] = useLazyQuery<
    SearchUserResponse,
    SearchUserVariables
  >(userOperations.Queries.searchUsers);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    searchUser({ variables: { username } });
  };

  console.log("search data", data);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='2d2d2d' pb={4}>
          <ModalHeader>Create Converation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder='Enter Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type='submit' isDisabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && <SearchedUserList users={data.searchUsers} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
