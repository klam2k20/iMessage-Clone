import { Prisma } from "@prisma/client";
import { equal } from "assert";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { isUserInConversation } from "../../util/functions";
import { GraphQLContext, MessagePopulated } from "../../util/types";
import { conversationPopulated } from "./conversation";

const resolvers = {
  Query: {
    messages: async (_: any, args: { conversationId: string }, context: GraphQLContext): Promise<Array<MessagePopulated>> => {
      const { session, prisma } = context;
      const { conversationId } = args;

      if (!session?.user) throw new GraphQLError('Unauthorized');
      const { user: { id: userId } } = session;

      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated
      });

      /**
       * Check that the conversation exists and the logged
       * in session user is part of the conversation
       */
      if (!conversation) throw new GraphQLError(`Conversation ${conversationId} is Non-Existent`);
      const isUserInConvo = isUserInConversation(userId, conversation.participants);
      if (!isUserInConvo) throw new GraphQLError('Unauthorized');

      /**
       * Find all messages that belong to the specified conversation
       */
      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId: conversationId
          },
          include: messagePopulated,
          orderBy: {
            createdAt: 'desc'
          },
        });
        return messages;
      } catch (error: any) {
        console.log('messages Error', error.message);
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    sendMessage: async (_: any, args: { conversationId: string }, context: GraphQLContext) => { },
  },

  // Add filter to only send updates to people subscribed to this conversation
  Subscription: {
    messageSent: {
      subscribe:
        (_: any, args: { conversationId: string }, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator('MESSAGE_SENT');
        }
    },
  },
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    }
  }
})