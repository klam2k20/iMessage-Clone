import { gql } from "apollo-server-core";

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

  type Subscription {
    conversationCreated: Conversation
  }
`

export default typeDefs;