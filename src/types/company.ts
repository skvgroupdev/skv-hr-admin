export type CompanyStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'

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
}

export interface CreateOwnerRequest {
  phone: string
  name: string
  password: string
}
