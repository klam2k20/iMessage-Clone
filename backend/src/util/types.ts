import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { conversationPopulated, participantPopulated } from "../graphql/resolvers/conversation";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}
export interface Session {
  user?: User;
  expires: ISODateString
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

export type participantPopulated = Prisma.ConversationParticipantGetPayload<{ include: typeof participantPopulated; }>
