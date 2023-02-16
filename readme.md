<p align="center">
    <img src="imgs/demo.gif">
</p>

## Overview

This is a responsive iMessage clone created with NextJS, MongoDB, and Apollo Client and
Server. The application supports real-time messaging in individual and group settings,
real-time notifications, and allows users to remove and/or add participants into conversations.

## Features

- Responsive Design
<p align="center">
    <img src="imgs/responsive.gif">
</p>

- Group Conversations
<p align="center">
    <img src="imgs/group-conversation.gif">
</p>

- Edit Group Conversation Participants
<p align="center">
    <img src="imgs/edit-conversation.gif">
</p>

- Leave Group Conversation and Delete Conversation
<p align="center">
    <img src="imgs/delete-conversation.gif">
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

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/klam2k20/iMessage-Clone.git
   ```
2. `cd iMessage-Clone/server`
3. Create `config.env` with your MongoDB URI
   ```sh
   PORT=4000
   MONG0DB_URI=<MONGODBURI>
   CLIENT_ORIGN=http://localhost:3000
   ```
4. Install npm packages
   ```sh
   npm install
   ```
5. Start backend
   ```sh
   npm run dev
   ```
6. `cd ../frontend`
7. Install npm packages
8. Start frontend on port 3000
   ```sh
   yarn start
   ```
