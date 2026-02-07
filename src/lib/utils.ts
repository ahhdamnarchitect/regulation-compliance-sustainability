import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Capitalize status for display: "active" → "Active", "proposed" → "Proposed", etc. */
export function formatStatus(status: string): string {
  if (!status) return status
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}
