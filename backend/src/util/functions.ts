import { ParticipantPopulated } from "./types";

export function isUserInConversation(userId: string, participants: Array<ParticipantPopulated>) {
  return !!participants.find(p => p.userId === userId);
}