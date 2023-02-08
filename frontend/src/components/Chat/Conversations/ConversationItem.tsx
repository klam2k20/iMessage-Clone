import { ConversationPopulated } from '@/../backend/src/util/types';
import { Flex } from '@chakra-ui/react';

interface IConversationItemProps {
  conversation: ConversationPopulated;
}

const ConversationItem: React.FC<IConversationItemProps> = ({ conversation }) => {
  return (
    <Flex py={2} px={4} borderRadius="md" _hover={{ bg: 'whiteAlpha.200' }}>
      {conversation.id}
    </Flex>
  );
};

export default ConversationItem;
