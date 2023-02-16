import { Prisma } from ".prisma/client";

/**
 * User Interfaces
 */
export interface CreateUsernameResponse {
  createUsername: {
    success: boolean;
    error: string;
  }
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUserResponse {
  searchUsers: Array<SearchedUser>;
}

export interface SearchUserVariables {
  username: string;
}

export interface SearchedUser {
  id: string;
  username: string;
}

/**
 * Conversation Interfaces
 */
export interface CreateConversationResponse {
  createConversation: {
    conversationId: string;
  }
}

export interface CreateConversationVariables {
  participants: Array<string>;
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true,
    }
  }
});

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
  participants: {
    include: participantPopulated
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        }
      }
    }
  },
})

export type ConversationPopulated = Prisma.ConversationGetPayload<{ include: typeof conversationPopulated; }>

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{ include: typeof participantPopulated; }>

export interface ConversationsResponse {
  conversations: Array<ConversationPopulated>;
}

export interface ConversationSubscriptionResponse {
  subscriptionData: {
    data: {
      conversationCreated: ConversationPopulated;
    }
  }
}

export interface MarkConversationAsReadResponse {
  markConversationAsRead: boolean;
}

export interface MarkConversationAsReadVariables {
  userId: string;
  conversationId: string;
}

export interface ConversationUpdatedSubscriptionResponse {
  conversationUpdated: {
    conversation: ConversationPopulated;
    addedParticipantIds: string[];
    deletedParticipantIds: string[];
  }
}

export interface ConversationDeletedSubscriptionResponse {
  conversationDeleted: {
    id: string;
  }
}

export interface DeleteConversationVariables {
  conversationId: string;
}

export interface DeleteConversationResponse {
  deleteConversation: boolean;
}

export interface UpdateConversationParticipantsVariables {
  conversationId: string;
  participantIds: string[];
}

export interface UpdateConversationParticipantsResponse {
  updateConversationParticipants: boolean;
}

/**
 * Message Interfaces
 */
export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    }
  }
});

export type MessagePopulated = Prisma.MessageGetPayload<{ include: typeof messagePopulated }>

export interface MessagesResponse {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionResponse {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    }
  }
}

export type SendMessageResponse = {
  sendMessage: boolean;
}

export type SendMessageVariables = {
  id: string
  senderId: string;
  conversationId: string;
  body: string;
}