import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: async (_: any, args: { username: string }, context: GraphQLContext): Promise<Array<User>> => {
      const { username: searchUsername } = args;
      const { session, prisma } = context;
      if (!session?.user) throw new GraphQLError('Unauthorized');

      try {
        const { user: { username: myUsername } } = session;
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchUsername,
              not: myUsername,
              mode: 'insensitive'
            }
          }
        });

        return users;
      } catch (error: any) {
        console.log('searchUser Error', error.message);
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    createUsername: async (_: any, args: { username: string }, context: GraphQLContext): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;
      if (!session?.user) return { error: 'Unauthorized' };

      try {
        const existingUsername = await prisma.user.findUnique({
          where: {
            username
          }
        });
        if (existingUsername) return { error: 'Username is Unavailable. Try Another' };

        await prisma.user.update({
          where: {
            id: session.user.id
          },
          data: {
            username
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log('createUsername Error', error.message);
        return { error: error.message };
      }
    },
  }
}

export default resolvers;