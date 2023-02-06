const resolvers = {
  Query: {
    searchUsers: () => { },
  },
  Mutation: {
    createUsername: () => {
      console.log('Create username API')
    },
  }
}

export default resolvers;