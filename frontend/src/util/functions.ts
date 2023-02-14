import { ParticipantPopulated } from "@/../backend/src/util/types";

export function formatConversationName(userId: string, participants: Array<ParticipantPopulated>) {
  const usernames = participants.filter(p => p.user.id != userId).map(p => p.user.username);
  return usernames.join(', ');
}

export function formatAvatars(userId: string, participants: Array<ParticipantPopulated>) {
  const usernames = participants.filter(p => p.user.id != userId).map(p => p.user.username);
  return usernames;
}

export function findUserParticipant(userId: string, participants: Array<ParticipantPopulated>): ParticipantPopulated | null {
  const participant = participants.find(p => p.user.id === userId);
  return participant || null;
}

