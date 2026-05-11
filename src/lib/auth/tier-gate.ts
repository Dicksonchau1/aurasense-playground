/**
 * Tier-gate utility — single source of truth for which scenarios a given
 * tier may access. Mirrors the NEPA `services/tier_policy` entitlements.
 *
 * Kept deliberately small and dependency-free so it can be imported from
 * the edge middleware as well as from React server/client components.
 */

export type Tier = 'free' | 'nursing' | 'enterprise'

export type ScenarioSlug =
  | 'who-handwash'
  | 'fall-risk-tug'
  | 'bed-mobility'
  | 'wound-dressing'
  | 'iv-setup'
  | 'ng-tube'
  | 'trach-care'

const FREE_OK: ReadonlySet<ScenarioSlug> = new Set(['who-handwash'])

const NURSING_OK: ReadonlySet<ScenarioSlug> = new Set([
  'who-handwash',
  'fall-risk-tug',
  'bed-mobility',
  'wound-dressing',
])

const ALL: ReadonlySet<ScenarioSlug> = new Set([
  'who-handwash',
  'fall-risk-tug',
  'bed-mobility',
  'wound-dressing',
  'iv-setup',
  'ng-tube',
  'trach-care',
])

export function canAccessScenario(tier: Tier, slug: string): boolean {
  if (!ALL.has(slug as ScenarioSlug)) return false
  switch (tier) {
    case 'free':
      return FREE_OK.has(slug as ScenarioSlug)
    case 'nursing':
      return NURSING_OK.has(slug as ScenarioSlug)
    case 'enterprise':
      return true
  }
}

export function requiredTierFor(slug: string): Tier {
  if (FREE_OK.has(slug as ScenarioSlug)) return 'free'
  if (NURSING_OK.has(slug as ScenarioSlug)) return 'nursing'
  return 'enterprise'
}

export function getUpsellMessage(slug: string, current: Tier): string {
  const required = requiredTierFor(slug)
  if (canAccessScenario(current, slug)) {
    return `${slug} is already available on your ${current} tier.`
  }
  if (required === 'nursing') {
    return `Upgrade to Nursing to unlock ${slug}.`
  }
  if (required === 'enterprise') {
    return `Upgrade to Enterprise (Hospital+) to unlock ${slug}.`
  }
  return `Sign in to unlock ${slug}.`
}

export const SCENARIO_LIST: readonly ScenarioSlug[] = [
  'who-handwash',
  'fall-risk-tug',
  'bed-mobility',
  'wound-dressing',
  'iv-setup',
  'ng-tube',
  'trach-care',
]
