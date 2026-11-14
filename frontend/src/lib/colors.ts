import type { Status } from "./types";

export const STATUS_COLORS: Record<Status | "empty", string> = {
  normal:   "#22c55e",   // green
  warning:  "#eab308",   // yellow
  critical: "#ef4444",   // red
  empty:    "#6b7280",   // gray
};

export const STATUS_LABEL: Record<Status | "empty", string> = {
  normal:   "🟢 Normal",
  warning:  "🟡 Watch",
  critical: "🔴 Act Now",
  empty:    "⚪ No Data",
};

export const STATUS_BG_TINT: Record<Status | "empty", string> = {
  normal:   "rgba(34, 197, 94, 0.12)",
  warning:  "rgba(234, 179, 8, 0.12)",
  critical: "rgba(239, 68, 68, 0.12)",
  empty:    "rgba(107, 114, 128, 0.12)",
};
