import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Display status: only "Proposed" or "Enacted". Active/enacted map to Enacted. */
export function formatStatus(status: string): string {
  if (!status) return status;
  const s = status.toLowerCase();
  if (s === 'proposed') return 'Proposed';
  return 'Enacted'; // active, enacted → Enacted
}

/** True if regulation status matches the filter value (Proposed/Enacted). */
export function statusMatchesFilter(regStatus: string, filterValue: string): boolean {
  const f = filterValue?.toLowerCase();
  const r = regStatus?.toLowerCase();
  if (f === 'proposed') return r === 'proposed';
  if (f === 'enacted') return r === 'active' || r === 'enacted';
  return false;
}
