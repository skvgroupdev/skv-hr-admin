import { apiClient } from './client'
import type { LeaveType, CreateLeaveTypeDto, LeaveRequest, CreateLeaveRequestDto, LeaveBalance } from '../types/leave'
import type { PaginatedResponse } from '../types/company'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

interface LeaveQuery {
  page?: number
  limit?: number
  status?: string
  year?: number
}

export const leaveApi = {
  // Leave Types
  listTypes: async (): Promise<LeaveType[]> => {
    const res = await apiClient.get('/leave-types')
    return unwrap<LeaveType[]>(res)
  },

  createType: async (body: CreateLeaveTypeDto): Promise<LeaveType> => {
    const res = await apiClient.post('/leave-types', body)
    return unwrap<LeaveType>(res)
  },

  updateType: async (id: string, body: Partial<CreateLeaveTypeDto>): Promise<LeaveType> => {
    const res = await apiClient.patch(`/leave-types/${id}`, body)
    return unwrap<LeaveType>(res)
  },

  deleteType: async (id: string): Promise<void> => {
    await apiClient.delete(`/leave-types/${id}`)
  },

  // Leave Requests
  getPending: async (): Promise<LeaveRequest[]> => {
    const res = await apiClient.get('/leave/pending')
    return unwrap<LeaveRequest[]>(res)
  },

  getReport: async (query: LeaveQuery): Promise<PaginatedResponse<LeaveRequest>> => {
    const res = await apiClient.get('/leave/report', { params: query })
    return res.data as PaginatedResponse<LeaveRequest>
  },

  createRequest: async (body: CreateLeaveRequestDto): Promise<LeaveRequest> => {
    const res = await apiClient.post('/leave/request', body)
    return unwrap<LeaveRequest>(res)
  },

  approve: async (id: string, comment?: string): Promise<LeaveRequest> => {
    const res = await apiClient.post(`/leave/${id}/approve`, { comment })
    return unwrap<LeaveRequest>(res)
  },

  reject: async (id: string, reason: string): Promise<LeaveRequest> => {
    const res = await apiClient.post(`/leave/${id}/reject`, { reason })
    return unwrap<LeaveRequest>(res)
  },

  getEmployeeBalance: async (employeeId: string): Promise<LeaveBalance[]> => {
    const res = await apiClient.get(`/leave/balance/${employeeId}`)
    return unwrap<LeaveBalance[]>(res)
  },
}
