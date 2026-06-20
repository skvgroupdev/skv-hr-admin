import type { ReactNode } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import type { PlanFeatures } from '../../types/plan'

interface FeatureGateProps {
  /** Feature key from PlanFeatures to check */
  feature: keyof PlanFeatures
  /** Rendered when the feature is enabled */
  children: ReactNode
  /** Rendered when feature is disabled — optional */
  fallback?: ReactNode
}

/**
 * Renders children only when the current user's plan includes the given feature.
 * SUPER_ADMIN always passes (they manage the platform, not bound to a plan).
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  // Super admin bypasses all feature flags
  if (user.role === 'SUPER_ADMIN') return <>{children}</>

  const isEnabled = user.features?.[feature] ?? false

  return isEnabled ? <>{children}</> : <>{fallback}</>
}
