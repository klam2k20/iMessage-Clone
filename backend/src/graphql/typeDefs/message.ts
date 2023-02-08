import { gql } from "apollo-server-core";

const typeDefs = gql`
scalar Date

  type Message {
    id: String
    sender: User
    body: String
    # isLatestIn: Conversation
    createdAt: Date
    updatedAt: Date
  }
`

export default typeDefs;