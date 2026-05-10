export const BookStatus = {
  NOT_STARTED: "NOT_STARTED",
  READING: "READING",
  COMPLETED: "COMPLETED",
  PAUSED: "PAUSED",
} as const;

export type BookStatusType = (typeof BookStatus)[keyof typeof BookStatus];
