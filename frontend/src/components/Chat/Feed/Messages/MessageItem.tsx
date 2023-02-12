import { MessagePopulated } from '@/../backend/src/util/types';
import { Avatar, Flex, Stack, Text } from '@chakra-ui/react';
import formatRelative from 'date-fns/formatRelative';
import enUS from 'date-fns/locale/en-US';

/**
 * Format Relative will return a token describing the date
 * in words relative to the given base date such as
 * yesterday, today, and other. The formatRelative
 * in locale will take the returned token
 * and use it to determine the format of the date
 */
const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: 'p',
  other: 'MM/dd/yy',
};

interface IMessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
  hasAvatar: boolean;
  hasUsername: boolean;
  hasDateTime: boolean;
}

const MessageItem: React.FC<IMessageItemProps> = ({
  message,
  sentByMe,
  hasAvatar,
  hasUsername,
  hasDateTime,
}) => {
  return (
    <Stack w="100%" spacing={0}>
      {hasDateTime && (
        <Text textAlign="center" fontSize={14} color="whiteAlpha.700" my="0.5rem">
          {formatRelative(new Date(message.createdAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: token =>
                formatRelativeLocale[token as keyof typeof formatRelativeLocale],
            },
          })}
        </Text>
      )}
      {hasUsername && !sentByMe && (
        <Flex align="center" gap={2}>
          <Avatar size="xs" src="" name={message.sender.username} visibility="hidden" />
          <Text textAlign="left" fontSize={14} color="whiteAlpha.700">
            {message.sender.username}
          </Text>
        </Flex>
      )}
      <Flex align="center" gap={2} justify={sentByMe ? 'end' : 'start'}>
        <Avatar
          size="xs"
          src=""
          name={message.sender.username}
          visibility={hasAvatar && !sentByMe ? 'visible' : 'hidden'}
          alignSelf="flex-end"
        />
        <Text
          py={1}
          px={2}
          fontSize="1rem"
          fontWeight={500}
          bg={sentByMe ? 'brand.100' : 'whiteAlpha.300'}
          wordBreak="break-word"
          maxW="65%"
          borderRadius="md">
          {message.body}
        </Text>
      </Flex>
    </Stack>
  );
};

export default MessageItem;
