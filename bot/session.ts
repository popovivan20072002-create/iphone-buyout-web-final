import { createEmptySession, type BotSession } from "./types";

const sessions = new Map<number, BotSession>();

export function getSession(chatId: number): BotSession {
  let session = sessions.get(chatId);
  if (!session) {
    session = createEmptySession();
    sessions.set(chatId, session);
  }
  return session;
}

export function resetSession(chatId: number): BotSession {
  const session = createEmptySession();
  sessions.set(chatId, session);
  return session;
}

export function clearSession(chatId: number): void {
  sessions.delete(chatId);
}
