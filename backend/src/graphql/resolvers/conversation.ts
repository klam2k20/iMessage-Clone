import { GraphQLContext } from "../../util/types";

const resolvers = {
  Mutation: {
    createConversation: async (_: any, args: Array<string>, context: GraphQLContext) => {
      console.log('Create conversation', args);
    },
  },
}

export default resolvers;