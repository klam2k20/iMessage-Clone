import conversationOperations from '@/src/graphql/operations/conversation';
import { ConversationsResponse } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import { Button, Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import * as React from 'react';
import { BiMessageSquareDots } from 'react-icons/bi';
import ConversationModal from '../Conversations/Modal/ConversationModal';

interface IFeedStartProps {
  session: Session;
}

const FeedStart: React.FC<IFeedStartProps> = ({ session }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onOpen = () => setIsOpen(true);

  /** Queries */
  const { data, loading, error, subscribeToMore } = useQuery<ConversationsResponse>(
    conversationOperations.Queries.conversations
  );

  if (!data?.conversations || loading || error) return null;

  const hasConversations = data.conversations.length;
  const action = hasConversations ? 'Select a Conversation' : "Let's Get Started 🥳";
  return (
    <Flex flexDirection="column" h="100%" align="center" justify="center" gap={2}>
      {hasConversations > 0 && <BiMessageSquareDots fontSize={90} />}
      <Text textAlign="center" fontSize={40}>
        {action}
      </Text>
      {hasConversations == 0 && (
        <Button bg="brand.100" onClick={onOpen}>
          Start A Conversation!
        </Button>
      )}
      <ConversationModal
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        conversations={data.conversations}
      />
    </Flex>
  );
};

export default FeedStart;
