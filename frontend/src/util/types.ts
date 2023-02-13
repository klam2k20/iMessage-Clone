import {
  ConversationPopulated, MessagePopulated,
} from "../../../backend/src/util/types";

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
    /**
     * Add removed and added users
     */
  }
}

/**
 * Message Interfaces
 */
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