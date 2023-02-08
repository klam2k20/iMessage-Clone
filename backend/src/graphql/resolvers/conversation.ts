import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { ConversationPopulated, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    conversations: async (_: any, __: any, context: GraphQLContext): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;

      if (!session?.user) throw new ApolloError('Unauthorized');

      const { user: { id: userId } } = session;
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
    }
  },

  Mutation: {
    createConversation: async (_: any, args: { participants: Array<string> }, context: GraphQLContext): Promise<{ conversationId: string }> => {
      const { participants: participantIds } = args;
      const { session, prisma } = context;

      if (!session?.user) throw new ApolloError('Unauthorized')
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
        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log('createConversation Error', error.message);
        throw new ApolloError(error.message);
      }
    },
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