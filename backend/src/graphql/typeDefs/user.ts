import { gql } from 'apollo-server-core';

const typeDefs = gql`
  type User {
    id: String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    images: String
  }

  type SearchedUser {
    id: String
    username: String
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
  
  type Query {
    searchUsers(username: String): [SearchedUser]
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }
`

export default typeDefs;