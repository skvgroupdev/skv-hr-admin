import { apiClient } from './client'
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeDocument,
  EmployeeStatus,
  UploadDocumentDto,
} from '../types/employee'
import type { PaginatedResponse } from '../types/company'

interface ListParams {
  page?: number
  limit?: number
  sort?: string
  branchId?: string
  departmentId?: string
  status?: EmployeeStatus
  search?: string
}

// Server returns { data: T } — unwrap extracts the inner data field
const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const employeesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Employee>> => {
    const res = await apiClient.get('/employees', {
      params: { page: 1, limit: 20, sort: '-createdAt', ...params },
    })
    // res.data is already { data: Employee[], meta: {...} } — no unwrap needed
    return res.data as PaginatedResponse<Employee>
  },

  getById: async (id: string): Promise<Employee> => {
    const res = await apiClient.get(`/employees/${id}`)
    return unwrap<Employee>(res)
  },

  create: async (body: CreateEmployeeDto): Promise<Employee> => {
    const res = await apiClient.post('/employees', body)
    return unwrap<Employee>(res)
  },

  update: async (id: string, body: UpdateEmployeeDto): Promise<Employee> => {
    const res = await apiClient.patch(`/employees/${id}`, body)
    return unwrap<Employee>(res)
  },

  deactivate: async (id: string): Promise<Employee> => {
    const res = await apiClient.post(`/employees/${id}/deactivate`)
    return unwrap<Employee>(res)
  },

  reactivate: async (id: string): Promise<Employee> => {
    const res = await apiClient.post(`/employees/${id}/reactivate`)
    return unwrap<Employee>(res)
  },

  uploadDocument: async (id: string, body: UploadDocumentDto): Promise<EmployeeDocument> => {
    const res = await apiClient.post(`/employees/${id}/upload-document`, body)
    return unwrap<EmployeeDocument>(res)
  },

  getDocuments: async (id: string): Promise<EmployeeDocument[]> => {
    const res = await apiClient.get(`/employees/${id}/documents`)
    return unwrap<EmployeeDocument[]>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`)
  },

  changePassword: async (id: string, body: { newPassword: string }): Promise<void> => {
    await apiClient.patch(`/employees/${id}/password`, body)
  },
}
