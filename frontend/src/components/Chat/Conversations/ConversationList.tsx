import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";

interface IConversationListProps {
  session: Session;
}

const ConversationList: React.FC<IConversationListProps> = ({ session }) => {
  return (
    <Box w='100%'>
      <Box bg='blackAlpha.300' py={2} px={4} borderRadius='md' cursor='pointer'>
        <Text textAlign='center' color='whiteAlpha.800' fontWeight={500}>
          Find or Start a Conversation
        </Text>
      </Box>
    </Box>
  );
};

export default ConversationList;
