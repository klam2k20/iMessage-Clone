import { gql } from "apollo-server-core";

const typeDefs = gql`
  type CreateConversationResponse {
    conversationId: String
  }

  type Mutation {
    createConversation(participants: [String]): CreateConversationResponse
}
`

export default typeDefs;