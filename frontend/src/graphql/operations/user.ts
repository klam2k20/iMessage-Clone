import { gql } from "@apollo/client"

const userOperations = {
  Queries: {},
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
