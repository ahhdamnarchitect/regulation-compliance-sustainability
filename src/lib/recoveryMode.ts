/** Session storage key and event for "recovery pending" (user must set new password after reset link). */
export const RECOVERY_PENDING_KEY = 'recovery_pending';
export const RECOVERY_PENDING_EVENT = 'recovery_pending_change';

export function setRecoveryPending(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    sessionStorage.setItem(RECOVERY_PENDING_KEY, 'true');
  } else {
    sessionStorage.removeItem(RECOVERY_PENDING_KEY);
  }
  window.dispatchEvent(new CustomEvent(RECOVERY_PENDING_EVENT));
}

export function getRecoveryPending(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(RECOVERY_PENDING_KEY) === 'true';
}
