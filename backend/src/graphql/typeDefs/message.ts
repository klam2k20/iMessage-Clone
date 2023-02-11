import { gql } from "graphql-tag";

const typeDefs = gql`
scalar Date

  type Message {
    id: String
    sender: User
    # conversation: Conversation
    body: String
    # isLatestIn: Conversation
    createdAt: Date
    updatedAt: Date
  }

  # Query all messages for the specified conversation
  type Query {
    messages(conversationId: String): [Message]
  }, 

  type Mutation {
    sendMessage(senderId: String, conversationId: String, body: String): Boolean
  },

  # Subscribe to the following conversation to get updated messages
  type Subscription {
    messageSent(conversationId: String): Message
  },
`

export default typeDefs;