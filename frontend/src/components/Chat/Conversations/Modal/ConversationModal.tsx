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

interface IConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<IConversationModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    console.log(username);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='2d2d2d' pb={4}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder='Enter Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type='submit' isDisabled={!username}>
                  Search
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
