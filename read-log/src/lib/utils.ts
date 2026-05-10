export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ""}`;
  }
  return `${mins}分钟`;
}

export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export const COVER_COLORS = [
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#0891b2",
  "#65a30d",
  "#dc2626",
  "#4f46e5",
  "#059669",
];
