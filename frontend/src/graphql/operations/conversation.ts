import { gql } from "@apollo/client";

const conversationOperations = {
  Queries: {},
  Mutations: {
    createConversation: gql`
      mutation createConversation($participants: [String]!) {
        createConversation(participants: $participants) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {}
}

export default conversationOperations;