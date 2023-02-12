import { Avatar, Flex, Skeleton, SkeletonCircle, Stack, Text } from '@chakra-ui/react';

export const ConversationsSkeleton: React.FunctionComponent = () => {
  return (
    <Stack>
      <Skeleton height="64px" />
      <Skeleton height="64px" />
      <Skeleton height="64px" />
      <Skeleton height="64px" />
      <Skeleton height="64px" />
    </Stack>
  );
};

export const MessageHeaderSkeleton: React.FunctionComponent = () => {
  return (
    <Stack justify="center">
      <SkeletonCircle size="16" mx="auto" />
      <Skeleton height="32px" />
    </Stack>
  );
};

export const MessagesSkeleton: React.FunctionComponent = () => {
  return (
    <Stack>
      <Flex flexDirection="column" align="start" gap={1}>
        <Skeleton height="32px" w="65%" />
        <Skeleton height="32px" w="65%" />
        <Skeleton height="32px" w="65%" />
      </Flex>
      <Flex flexDirection="column" align="end" gap={1}>
        <Skeleton height="32px" w="65%" />
        <Skeleton height="32px" w="65%" />
        <Skeleton height="32px" w="65%" />
      </Flex>
    </Stack>
  );
};
