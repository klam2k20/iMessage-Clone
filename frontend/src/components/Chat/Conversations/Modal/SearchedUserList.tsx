import { SearchedUser } from '@/src/util/types';
import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react';

interface ISearchedUserListProps {
  users: Array<SearchedUser>;
  participants: Array<SearchedUser>;
  addParticipant: (participant: SearchedUser) => void;
}

const SearchedUserList: React.FunctionComponent<ISearchedUserListProps> = ({
  users,
  participants,
  addParticipant,
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Text textAlign="center" mt={4} fontWeight={500}>
          No Users Found
        </Text>
      ) : (
        <Stack mt={4} spacing={4}>
          {users.map(user => (
            <Flex
              key={user.id}
              gap={4}
              align="center"
              py={2}
              px={4}
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.300' }}>
              <Avatar src="" name={user.username} />
              <Flex w="100%" justify="space-between" align="center">
                <Text>{user.username}</Text>
                <Button
                  bg="brand.100"
                  _hover={{ bg: 'brand.100' }}
                  onClick={() => addParticipant(user)}
                  isDisabled={!!participants.find(p => p.id === user.id)}>
                  Select
                </Button>
              </Flex>
            </Flex>
          ))}
        </Stack>
      )}
    </>
  );
};

export default SearchedUserList;
