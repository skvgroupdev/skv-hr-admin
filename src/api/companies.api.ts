import { apiClient } from './client'
import type {
  AssignPlanRequest,
  Company,
  CompanyUsage,
  CreateCompanyRequest,
  CreateOwnerRequest,
  PaginatedResponse,
  UpdateSubscriptionRequest,
} from '../types/company'

interface ListParams {
  page?: number
  limit?: number
  sort?: string
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const companiesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Company>> => {
    const res = await apiClient.get('/super/companies', {
      params: { page: 1, limit: 20, sort: '-createdAt', ...params },
    })
    // backend already returns { data: [...], meta: {...} } — no unwrap needed
    return res.data as PaginatedResponse<Company>
  },

  getById: async (id: string): Promise<Company> => {
    const res = await apiClient.get(`/super/companies/${id}`)
    return unwrap<Company>(res)
  },

  create: async (body: CreateCompanyRequest): Promise<Company> => {
    const res = await apiClient.post('/super/companies', body)
    return unwrap<Company>(res)
  },

  update: async (id: string, body: Partial<CreateCompanyRequest>): Promise<Company> => {
    const res = await apiClient.patch(`/super/companies/${id}`, body)
    return unwrap<Company>(res)
  },

  activate: async (id: string): Promise<Company> => {
    const res = await apiClient.post(`/super/companies/${id}/activate`)
    return unwrap<Company>(res)
  },

  suspend: async (id: string): Promise<Company> => {
    const res = await apiClient.post(`/super/companies/${id}/suspend`)
    return unwrap<Company>(res)
  },

  createOwner: async (id: string, body: CreateOwnerRequest): Promise<void> => {
    await apiClient.post(`/super/companies/${id}/create-owner`, body)
  },

  assignPlan: async (id: string, body: AssignPlanRequest): Promise<Company> => {
    const res = await apiClient.post(`/super/companies/${id}/assign-plan`, body)
    return unwrap<Company>(res)
  },

  updateSubscription: async (
    id: string,
    body: UpdateSubscriptionRequest,
  ): Promise<Company> => {
    const res = await apiClient.patch(`/super/companies/${id}/subscription`, body)
    return unwrap<Company>(res)
  },

  extendSubscription: async (
    id: string,
    body: Pick<UpdateSubscriptionRequest, 'endDate' | 'isPaid'>,
  ): Promise<Company> => {
    const res = await apiClient.post(`/super/companies/${id}/subscription/extend`, body)
    return unwrap<Company>(res)
  },

  usage: async (id: string): Promise<CompanyUsage> => {
    const res = await apiClient.get(`/super/companies/${id}/usage`)
    return unwrap<CompanyUsage>(res)
  },
}
