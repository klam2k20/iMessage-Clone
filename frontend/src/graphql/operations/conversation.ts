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
    createdAt
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
    markConversationAsRead: gql`
      mutation markConversationAsRead($userId: String!, $conversationId: String!) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription conversationCreated {
        conversationCreated {
          ${conversationPopulated}
        }
      }
    `,
    conversationUpdated: gql`
      subscription conversationUpdated {
        conversationUpdated {
          conversation {
            ${conversationPopulated}
          }
        }
      }
    `,
  }
}

export default conversationOperations;