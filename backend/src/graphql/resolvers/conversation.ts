import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { isUserInConversation } from '../../util/functions';
import { ConversationPopulated, ConversationUpdatedSubscriptionResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    conversations: async (_: any, __: any, context: GraphQLContext): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;
      if (!session?.user) throw new GraphQLError('Unauthorized');
      const { user: { id: userId } } = session;

      try {
        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: userId
                }
              }
            }
          },
          include: conversationPopulated,
        });

        return conversations;
      } catch (error: any) {
        console.log('conversations Error', error.message);
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    createConversation: async (_: any, args: { participants: Array<string> }, context: GraphQLContext): Promise<{ conversationId: string }> => {
      const { participants: participantIds } = args;
      const { session, prisma, pubsub } = context;
      if (!session?.user) throw new GraphQLError('Unauthorized')

      try {
        const { user: { id: userId } } = session;
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map(id => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                }))
              }
            }
          },
          include: conversationPopulated,
        });

        /**
         * Publish CONVERSATION_CREATED event 
         * and pass the payload to the associated
         * subscription
         */
        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation,
        });

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log('createConversation Error', error.message);
        throw new GraphQLError(error.message);
      }
    },

    markConversationAsRead: async (_: any, args: { userId: string, conversationId: string }, context: GraphQLContext) => {
      const { session, prisma } = context;
      const { userId, conversationId } = args;
      if (!session?.user) throw new GraphQLError('Unauthorized');

      try {
        /**
         * Find conversation participant to use the participant id in the update
         */
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId
          }
        });

        /**
         * Should never be the case
         */
        if (!participant) throw new GraphQLError("Participant Non-Existent");

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id
          },
          data: {
            hasSeenLatestMessage: true
          }
        });

        return true;
      } catch (error: any) {
        console.log('markConversationAsRead Error', error.message);
        throw new GraphQLError(error.message);
      }
    },

    deleteConversation: async (_: any, args: { conversationId: string }, context: GraphQLContext): Promise<boolean> => {
      const { session, prisma, pubsub } = context;
      const { conversationId } = args;
      if (!session?.user) throw new GraphQLError('Unauthorized');

      try {
        /**
         * Delete all entities related to the conversation - 
         * conversation participants and messages
         */
        const [deletedConversation] = await prisma.$transaction([
          prisma.conversation.delete({
            where: {
              id: conversationId
            },
            include: conversationPopulated,
          }),
          prisma.conversationParticipant.deleteMany({
            where: {
              conversationId,
            }
          }),
          prisma.message.deleteMany({
            where: {
              conversationId
            }
          })
        ]);

        pubsub.publish("CONVERSATION_DELETED", {
          conversationDeleted: deletedConversation
        });

        return true;
      } catch (error: any) {
        console.log('deleteConversation Error', error.message);
        throw new GraphQLError(error.message);
      }
    }
  },

  Subscription: {
    conversationCreated: {
      /**
       * Listen on the CONVERSATION_CREATED event and send it to 
       * a client if it passes the filter function
       */
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (payload: { conversationCreated: ConversationPopulated }, _, context: GraphQLContext) => {
          const { session } = context;
          if (!session?.user) throw new GraphQLError('Unauthorized');

          const { user: { id: userId } } = session;
          const { conversationCreated: { participants } } = payload;
          /**
           * If the logged in user isn't in the newly created conversation don't notify the user 
           * of the event. The session.user.id is different for every logged in user
           */
          return isUserInConversation(userId, participants);
        }
      )
    },

    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['CONVERSATION_UPDATED']);
        },
        (payload: ConversationUpdatedSubscriptionResponse, _, context: GraphQLContext) => {
          const { session } = context;
          if (!session?.user) throw new GraphQLError('Unauthorized');
          const { user: { id: userId } } = session;
          const { conversationUpdated: { conversation: { participants } } } = payload;

          return isUserInConversation(userId, participants);
        }
      )
    },

    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['CONVERSATION_DELETED']);
        },
        (payload: { conversationDeleted: ConversationPopulated }, _: any, context: GraphQLContext) => {
          const { session } = context;
          if (!session?.user) throw new GraphQLError('Unauthorized');

          const { user: { id: userId } } = session;
          const { conversationDeleted: { participants } } = payload;

          return isUserInConversation(userId, participants);
        }
      )
    }
  },
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

export default resolvers;