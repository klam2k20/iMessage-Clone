import { gql } from "graphql-tag";

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