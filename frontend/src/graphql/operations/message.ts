import { gql } from "@apollo/client";

const messagePopulated = `
  id
  sender {
    id
    username  
  }
  body
  createdAt
`;

const messageOperations = {
  Queries: {
    messages: gql`
      query messages($conversationId: String!) {
        messages(conversationId: $conversationId) {
          ${messagePopulated}
        }
      }
    `,
  },

  Mutations: {
    sendMessage: gql`
      mutation sendMessage($id: String!, $senderId: String!, $conversationId: String!, $body: String!) {
        sendMessage(id: $id, senderId: $senderId, conversationId: $conversationId, body: $body)
      }
    `,
  },

  Subscriptions: {
    messageSent: gql`
      subscription messageSent($conversationId: String!) {
        messageSent(conversationId: $conversationId) {
          ${messagePopulated}
        }
      }
    `,
  }
}

export default messageOperations;