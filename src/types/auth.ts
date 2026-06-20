export type Role =
  | 'SUPER_ADMIN'
  | 'COMPANY_OWNER'
  | 'HR_ADMIN'
  | 'BRANCH_MANAGER'
  | 'SUPERVISOR'
  | 'STAFF'

export type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'SUSPENDED'

export interface SubscriptionSummary {
  status: SubscriptionStatus
  endDate: string | null
  planName: string
  isPaid: boolean
}

export interface User {
  id: string
  phone: string
  name: string
  firstName?: string
  lastName?: string
  role: Role
  companyId: string | null
  branchId: string | null
  features?: import('./plan').PlanFeatures
  employeeId?: string
  employeeCode?: string
  position?: { id: string; name: string; banding?: string }
  department?: { id: string; name: string }
  branch?: { id: string; name: string }
  startDate?: string
  employmentType?: string
  status?: string
  workSchedule?: { startTime: string; endTime: string }
  email?: string
  avatarUrl?: string
  address?: string
  bankName?: string
  bankAccount?: string
  subscriptionSummary?: SubscriptionSummary
}

export interface LoginRequest {
  phone: string
  password: string
  companyCode?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}
