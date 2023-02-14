import { ConversationPopulated } from '@/../backend/src/util/types';
import { formatAvatars, formatConversationName } from '@/src/util/functions';
import { Avatar, AvatarGroup, Flex, Menu, MenuItem, MenuList, Text } from '@chakra-ui/react';
import formatRelative from 'date-fns/formatRelative';
import enUS from 'date-fns/locale/en-US';
import React, { useState } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdOutlineDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

/**
 * Format Relative will return a token describing the date
 * in words relative to the given base date such as
 * yesterday, today, and other. The formatRelative
 * in locale will take the returned token
 * and use it to determine the format of the date
 */
const formatRelativeLocale = {
  lastWeek: 'eeee',
  yesterday: "'Yesterday'",
  today: 'p',
  other: 'MM/dd/yy',
};

interface IConversationItemProps {
  userId: string;
  conversation: ConversationPopulated;
  onClick: () => void;
  isSelected: boolean;
  hasSeenLatestMessage: boolean;
  onDeleteConversation: () => void;
  onEditConversation: () => void;
  onLeaveConversation: () => void;
}

const ConversationItem: React.FC<IConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  isSelected,
  hasSeenLatestMessage,
  onDeleteConversation,
  onEditConversation,
  onLeaveConversation,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const formatAvatar = formatAvatars(userId, conversation.participants);

  const handleClick = (e: React.MouseEvent) => {
    if (e.type === 'click') onClick();
    else if (e.type === 'contextmenu') {
      e.preventDefault();
      setMenuOpen(true);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    /**
     * Stop propagation prevents the onClick event
     * from propogating upward to the parent flex
     * which also has a onClick event
     */
    e.stopPropagation();
    onDeleteConversation();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditConversation();
  };

  const handleLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLeaveConversation();
  };

  return (
    <Flex
      h="4rem"
      align="center"
      justify="center"
      p={2}
      cursor="pointer"
      borderRadius="md"
      bg={isSelected ? 'whiteAlpha.200' : 'none'}
      _hover={{ bg: 'whiteAlpha.200' }}
      gap={2}
      onClick={e => handleClick(e)}
      onContextMenu={e => handleClick(e)}
      position="relative">
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg="#2d2d2d">
          <MenuItem
            bg="#2d2d2d"
            _hover={{ bg: 'whiteAlpha.300' }}
            icon={<MdOutlineModeEditOutline fontSize={16} />}
            onClick={e => handleEdit(e)}>
            Edit
          </MenuItem>
          {conversation.participants.length > 2 ? (
            <MenuItem
              bg="#2d2d2d"
              _hover={{ bg: 'whiteAlpha.300' }}
              icon={<MdOutlineDeleteOutline fontSize={16} />}
              onClick={e => handleLeave(e)}>
              Leave
            </MenuItem>
          ) : (
            <MenuItem
              bg="#2d2d2d"
              _hover={{ bg: 'whiteAlpha.300' }}
              icon={<MdOutlineDeleteOutline fontSize={16} />}
              onClick={e => handleDelete(e)}>
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      {hasSeenLatestMessage === false && <GoPrimitiveDot fontSize={16} color="#1982FC" />}
      <Flex flex={1} justify="center">
        {conversation.participants.length == 2 ? (
          <Avatar src="" name={formatAvatar[0]} />
        ) : (
          <AvatarGroup size="sm">
            <Avatar src="" name={formatAvatar[0]} />
            <Avatar src="" name={formatAvatar[1]} />
          </AvatarGroup>
        )}
      </Flex>
      <Flex flex={4} flexDirection="column" w="80%" maxW="80%">
        <Flex justify="space-between" gap={1}>
          <Text flex={3} fontWeight={600} isTruncated>
            {formatConversationName(userId, conversation.participants)}
          </Text>
          <Text
            flex={2}
            whiteSpace="nowrap"
            overflowX="hidden"
            color="whiteAlpha.700"
            textAlign="right">
            {formatRelative(new Date(conversation.updatedAt), new Date(), {
              locale: {
                ...enUS,
                formatRelative: token =>
                  formatRelativeLocale[token as keyof typeof formatRelativeLocale],
              },
            })}
          </Text>
        </Flex>
        {conversation.latestMessage && (
          <Text color="whiteAlpha.700" isTruncated>
            {conversation.latestMessage.body}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default ConversationItem;
