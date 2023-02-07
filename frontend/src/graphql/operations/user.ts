import { gql } from "@apollo/client"

const userOperations = {
  Queries: {
    searchUser: gql`
      query searchUser($username: String!) {
        searchUser(username: $username) {
          id,
          username,
        }
    }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation createUsername($username: String!) {
        createUsername(username: $username) {
          success,
          error,
        }
      }
    `,
  },
  Subscriptions: {}
}

export default userOperations;
