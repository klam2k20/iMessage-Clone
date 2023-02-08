import { gql } from "@apollo/client";

const conversationPopulated = `
  id
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
  latestMessage {
    id
    sender {
      id
      username
    }
    body
  }
  updatedAt
`

const conversationOperations = {
  Queries: {
    conversations: gql`
      query conversations {
        conversations {
          ${conversationPopulated}
        }
      }
    `
  },
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