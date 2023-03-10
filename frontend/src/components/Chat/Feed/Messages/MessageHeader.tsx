import { ConversationPopulated } from '@/src/util/types';
import { MessageHeaderSkeleton } from '@/src/components/Common/SkeletonLoader';
import { formatAvatars, formatConversationName } from '@/src/util/functions';
import { ConversationsResponse } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import { Avatar, AvatarGroup, Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdArrowBackIosNew } from 'react-icons/md';
import conversationOperations from '../../../../graphql/operations/conversation';

interface IMessageHeaderProps {
  userId: string;
  conversationId: string;
}

const MessageHeader: React.FC<IMessageHeaderProps> = ({ userId, conversationId }) => {
  const router = useRouter();

  /** Queries */
  const { data, loading } = useQuery<ConversationsResponse>(
    conversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find(
    c => c.id === conversationId
  ) as ConversationPopulated;

  return (
    <>
      {loading && <MessageHeaderSkeleton />}
      {conversation && (
        <Flex
          p={4}
          align="center"
          borderBottom="1px solid"
          borderColor="whiteAlpha.200"
          justify="space-between">
          <Button
            display={{ md: 'none' }}
            bg="#2d2d2d"
            _hover={{ bg: '#2d2d2d' }}
            onClick={() => router.replace('?conversationId', '/', { shallow: true })}>
            <MdArrowBackIosNew fontSize={16} color="#3d84f7" />
          </Button>

          <Flex flexDirection="column" h="100%" w="100%" align="center">
            {conversation.participants.length == 2 ? (
              <Avatar src="" name={formatAvatars(userId, conversation.participants)[0] || ''} />
            ) : (
              <AvatarGroup size="md" max={2}>
                {formatAvatars(userId, conversation.participants).map(username => (
                  <Avatar key={username} src="" name={username || ''} />
                ))}
              </AvatarGroup>
            )}
            <Text fontWeight={600}>
              {conversation.participants.length == 2
                ? formatConversationName(userId, conversation.participants)
                : `${conversation.participants.length - 1} People`}
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default MessageHeader;
