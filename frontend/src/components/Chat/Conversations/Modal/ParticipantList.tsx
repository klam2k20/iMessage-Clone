import { SearchedUser } from '@/src/util/types';
import { Flex, Text } from '@chakra-ui/react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface IParticipantListProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const ParticipantList: React.FC<IParticipantListProps> = ({ participants, removeParticipant }) => {
  return (
    <Flex gap={5} mt={4} wrap="wrap">
      {participants.map(p => (
        <Flex key={p.id} align="center" bg="whiteAlpha.200" borderRadius="md" py={1} px={2} gap={2}>
          <Text>{p.username}</Text>
          <IoIosCloseCircleOutline
            size={20}
            cursor="pointer"
            onClick={() => removeParticipant(p.id)}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default ParticipantList;
