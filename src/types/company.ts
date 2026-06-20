import type { Plan } from './plan'

export type CompanyStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'
export type CompanySubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'SUSPENDED'

export interface CompanySubscription {
  startDate?: string
  endDate?: string
  status: CompanySubscriptionStatus
  isPaid: boolean
}

export interface Company {
  id: string
  name: string
  logo?: string
  taxId?: string
  address?: string
  phone?: string
  email?: string
  defaultLanguage: string
  defaultTimezone: string
  status: CompanyStatus
  planId?: string | Plan | null
  subscription?: CompanySubscription
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateCompanyRequest {
  name: string
  email?: string
  phone?: string
  taxId?: string
  address?: string
  defaultTimezone: string
  defaultLanguage: string
  planId?: string
}

export interface CreateOwnerRequest {
  phone: string
  name: string
  password: string
}

export interface AssignPlanRequest {
  planId: string
  startDate: string
  endDate: string
  isPaid?: boolean
}

export interface UpdateSubscriptionRequest {
  startDate?: string
  endDate?: string
  status?: CompanySubscriptionStatus
  isPaid?: boolean
}

export interface CompanyUsage {
  companyId: string
  employees: number
  branches: number
  storageUsedGB: number
  limits: {
    maxEmployees: number
    maxBranches: number
    maxStorageGB: number
  } | null
}
