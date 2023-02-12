import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Conversation {
    id: String
    participants: [Participant]
    messages: [Message]
    latestMessage: Message
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type CreateConversationResponse {
    conversationId: String
  }

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participants: [String]): CreateConversationResponse
  }

  type Mutation {
    markConversationAsRead(userId: String, conversationId: String): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
  }
`

export default typeDefs;