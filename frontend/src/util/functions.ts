import { ParticipantPopulated } from '@/src/util/types'
import { id } from "date-fns/locale";
import { SearchedUser } from "./types";

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

export function areParticipantsEqual(participantA: string[], participantB: string[]) {
  const sameLength = participantA.length === participantB.length;
  if (!sameLength) return false;
  const sameParticipants = participantA.reduce((acc, id) => acc && participantB.includes(id), true);
  return sameParticipants;
}