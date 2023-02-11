import { Prisma } from "@prisma/client";
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

      /**
       * Find all messages that belong to the specified conversation
       */
      try {
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
    sendMessage: async (_: any, args: { id: string, senderId: string, conversationId: string, body: string }, context: GraphQLContext): Promise<boolean> => {
      const { session, prisma, pubsub } = context;
      const { id, senderId, conversationId, body } = args;

      if (!session?.user || session.user.id !== senderId) throw new GraphQLError("Unauthorized");

      const { user: { id: userId } } = session;

      try {
        /**
       * Create message
       */
        const newMessage = await prisma.message.create({
          data: {
            id,
            senderId,
            conversationId,
            body,
          },
          include: messagePopulated
        });

        let conversation = await prisma.conversation.findUnique({
          where: {
            id: conversationId
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
         * Update conversation's latest message and conversation's participants'
         * hasSeenLatestMessage
         */
        conversation = await prisma.conversation.update({
          where: {
            id: conversationId
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              /**
               * Should this not be userId: senderId? I think update
               * only updates one item so the condition has to be on
               * a unique property and only id is unique on conversation
               * participants
               */
              update: {
                where: {
                  id: senderId,
                },
                data: {
                  hasSeenLatestMessage: true,
                }
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId
                  }
                },
                data: {
                  hasSeenLatestMessage: false,
                }
              }
            }
          },
          include: conversationPopulated,
        });

        pubsub.publish('MESSAGE_SENT', {
          messageSent: newMessage
        });

        return true;
      } catch (error: any) {
        console.log('sendMessage Error', error.message);
        throw new GraphQLError(error.message);
      }
    },
  },

  // Add filter to only send updates to people subscribed to this conversation
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator('MESSAGE_SENT');
        },
        (payload: { messageSent: MessagePopulated }, args: { conversationId: string }) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      )

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
});

export default resolvers;