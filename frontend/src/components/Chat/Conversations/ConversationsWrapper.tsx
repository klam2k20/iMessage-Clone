import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

interface IConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({ session }) => {
  return (
    <Box w={{ base: "100%", md: "400px" }} bg='whiteAlpha.50' py={8} px={4}>
      <ConversationList session={session} />
    </Box>
  );
};

export default ConversationWrapper;
