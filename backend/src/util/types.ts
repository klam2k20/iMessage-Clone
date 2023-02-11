import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { conversationPopulated, participantPopulated } from "../graphql/resolvers/conversation";
import { Context } from 'graphql-ws/lib/server';
import { PubSub } from 'graphql-subscriptions';
import { messagePopulated } from "../graphql/resolvers/message";

/** Configurations */
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}
export interface Session {
  user?: User;
  expires: ISODateString
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session
  }
}

/**
 * User
 */
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

/**
 * Conversation
 */
export type ConversationPopulated = Prisma.ConversationGetPayload<{ include: typeof conversationPopulated; }>

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{ include: typeof participantPopulated; }>

/**
 * Message
 */
export type MessagePopulated = Prisma.MessageGetPayload<{ include: typeof messagePopulated }>

export type SendMessageResponse = {
  sendMessage: boolean;
}

export type SendMessageVariables = {
  senderId: string;
  conversationId: string;
  body: string;
}
