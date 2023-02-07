import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationModal from "./Modal/ConversationModal";

interface IConversationListProps {
  session: Session;
}

const ConversationList: React.FC<IConversationListProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box w='100%'>
      <Box bg='blackAlpha.300' py={2} px={4} borderRadius='md' cursor='pointer'>
        <Text textAlign='center' color='whiteAlpha.800' fontWeight={500} onClick={onOpen}>
          Find or Start a Conversation
        </Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default ConversationList;
