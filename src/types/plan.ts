export interface PlanFeatures {
  attendance: boolean
  leave: boolean
  ot: boolean
  payroll: boolean
  advancedReport: boolean
  announcement: boolean
}

export interface Plan {
  id: string
  name: string
  description?: string
  maxEmployees: number
  maxBranches: number
  maxStorageGB: number
  features: PlanFeatures
  trialDays: number
  price: number
  currency: string
  isActive: boolean
  createdAt: string
}

export interface CreatePlanDto {
  name: string
  description?: string
  maxEmployees?: number
  maxBranches?: number
  maxStorageGB?: number
  features?: Partial<PlanFeatures>
  trialDays?: number
  price?: number
  currency?: string
}
