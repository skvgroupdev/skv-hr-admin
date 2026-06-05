import { apiClient } from './client'
import type {
  TaxConfig,
  CreateTaxConfigDto,
  CompanyTaxConfig,
  UpdateCompanyTaxConfigDto,
} from '../types/tax-config'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const taxConfigsApi = {
  list: async (): Promise<TaxConfig[]> => {
    const res = await apiClient.get('/tax-configs')
    return unwrap<TaxConfig[]>(res)
  },

  getCurrent: async (): Promise<TaxConfig> => {
    const res = await apiClient.get('/tax-configs/current')
    return unwrap<TaxConfig>(res)
  },

  create: async (body: CreateTaxConfigDto): Promise<TaxConfig> => {
    const res = await apiClient.post('/tax-configs', body)
    return unwrap<TaxConfig>(res)
  },

  update: async (id: string, body: Partial<CreateTaxConfigDto>): Promise<TaxConfig> => {
    const res = await apiClient.patch(`/tax-configs/${id}`, body)
    return unwrap<TaxConfig>(res)
  },
}

export const companyTaxConfigApi = {
  getMyConfig: async (): Promise<CompanyTaxConfig> => {
    const res = await apiClient.get('/tax-configs/company')
    return unwrap<CompanyTaxConfig>(res)
  },

  updateMyConfig: async (dto: UpdateCompanyTaxConfigDto): Promise<CompanyTaxConfig> => {
    const res = await apiClient.put('/tax-configs/company', dto)
    return unwrap<CompanyTaxConfig>(res)
  },

  getAllConfigs: async (): Promise<CompanyTaxConfig[]> => {
    const res = await apiClient.get('/tax-configs/companies')
    return unwrap<CompanyTaxConfig[]>(res)
  },

  updateConfig: async (tenantId: string, dto: UpdateCompanyTaxConfigDto): Promise<CompanyTaxConfig> => {
    const res = await apiClient.put(`/tax-configs/companies/${tenantId}`, dto)
    return unwrap<CompanyTaxConfig>(res)
  },
}
