import { apiClient } from './client'
import type { Shift, ShiftAssignment, CreateShiftDto, UpdateShiftDto, BulkAssignShiftRequest, BulkAssignResult } from '../types/shift'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const shiftsApi = {
  list: async (): Promise<Shift[]> => {
    const res = await apiClient.get('/shifts')
    return unwrap<Shift[]>(res)
  },

  getById: async (id: string): Promise<Shift> => {
    const res = await apiClient.get(`/shifts/${id}`)
    return unwrap<Shift>(res)
  },

  create: async (body: CreateShiftDto): Promise<Shift> => {
    const res = await apiClient.post('/shifts', body)
    return unwrap<Shift>(res)
  },

  update: async (id: string, body: UpdateShiftDto): Promise<Shift> => {
    const res = await apiClient.patch(`/shifts/${id}`, body)
    return unwrap<Shift>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/shifts/${id}`)
  },

  getEmployeeShift: async (employeeId: string): Promise<ShiftAssignment | null> => {
    try {
      const res = await apiClient.get(`/employees/${employeeId}/shift`)
      return unwrap<ShiftAssignment>(res)
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) return null
      throw error
    }
  },

  assign: async (
    shiftId: string,
    body: { employeeId: string; effectiveDate: string; endDate?: string },
  ): Promise<ShiftAssignment> => {
    const res = await apiClient.post(`/shifts/${shiftId}/assign`, body)
    return unwrap<ShiftAssignment>(res)
  },

  getEmployeeShiftHistory: async (employeeId: string): Promise<ShiftAssignment[]> => {
    const res = await apiClient.get(`/employees/${employeeId}/shift/history`)
    return unwrap<ShiftAssignment[]>(res)
  },

  bulkAssignShift: async (data: BulkAssignShiftRequest): Promise<BulkAssignResult> => {
    const res = await apiClient.post('/shifts/bulk-assign', data)
    return unwrap<BulkAssignResult>(res)
  },
}
