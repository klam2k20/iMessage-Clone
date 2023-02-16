<p align="center">
    <img src="imgs/demo.gif" height="500">
</p>

## Overview

This is a responsive iMessage clone. The application supports real-time messaging in individual
and group settings, real-time notifications, allows users to remove and/or add participants into conversations,
and delete and/or leave conversations.

## Technology

- <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
- <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
- <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
- <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
- <img src="https://img.shields.io/badge/Apollo%20GraphQL-311C87?&style=for-the-badge&logo=Apollo%20GraphQL&logoColor=white">
- <img src="https://img.shields.io/badge/Chakra--UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white">

## Features

- Responsive Design
<p align="center">
    <img src="imgs/responsive.gif" height="400">
</p>

- Authenication with NextAuth
<p align="center">
    <img src="imgs/next-auth.gif" height="400">
</p>

- Group Conversations
<p align="center">
    <img src="imgs/group-conversation.gif" height="400">
</p>

- Edit Group Conversation Participants
<p align="center">
    <img src="imgs/edit-conversation.gif" height="400">
</p>

- Leave Group Conversation and Delete Conversation
<p align="center">
    <img src="imgs/delete-conversation.gif" height="400">
</p>

- Real-time Notifications
<p align="center">
    <img src="imgs/notification.gif">
</p>

## Getting Started

### Prerequisites

- yarn/npm
- Sign up for MongoDB Atlas
  - Create a shared database

### Backend Installation

```sh
# Clone the repo
git clone https://github.com/klam2k20/iMessage-Clone.git

# Create config.env
cd iMessage-Clone/server
PORT=4000
MONG0DB_URI=<MONGODBURI>
CLIENT_ORIGN=http://localhost:3000

# Install dependencies
npm install

# Start the server
npm run dev
```

### Frontend Installation

```sh
cd ../frontend

# Install dependencies
npm install

# Start the application
npm run dev
```
