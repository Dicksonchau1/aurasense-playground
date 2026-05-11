// Minimal stub for usePlan — kept synchronous; `loading` is reserved for
// when this is swapped in for a real `/api/billing/me`-backed hook.
export interface UsePlanResult {
  plan: string
  loading: boolean
}

export function usePlan(): UsePlanResult {
  return { plan: 'pro_plus', loading: false }
}
