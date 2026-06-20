import { apiClient } from './client'
import type { AttendanceAdjustment, CreateAttendanceAdjustmentRequest } from '../types/attendance-adjustment'

function unwrap<T>(res: { data: unknown }): T {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const attendanceAdjustmentsApi = {
  mine: (): Promise<AttendanceAdjustment[]> =>
    apiClient.get('/attendance-adjustments/my').then(unwrap<AttendanceAdjustment[]>),

  list: (status?: string): Promise<AttendanceAdjustment[]> =>
    apiClient
      .get('/attendance-adjustments', { params: status ? { status } : undefined })
      .then(unwrap<AttendanceAdjustment[]>),

  create: (body: CreateAttendanceAdjustmentRequest): Promise<AttendanceAdjustment> =>
    apiClient.post('/attendance-adjustments', body).then(unwrap<AttendanceAdjustment>),

  cancel: (id: string): Promise<AttendanceAdjustment> =>
    apiClient.post(`/attendance-adjustments/${id}/cancel`).then(unwrap<AttendanceAdjustment>),

  approve: (id: string, comment?: string): Promise<AttendanceAdjustment> =>
    apiClient
      .post(`/attendance-adjustments/${id}/approve`, comment ? { comment } : {})
      .then(unwrap<AttendanceAdjustment>),

  reject: (id: string, reason: string): Promise<AttendanceAdjustment> =>
    apiClient
      .post(`/attendance-adjustments/${id}/reject`, { reason })
      .then(unwrap<AttendanceAdjustment>),
}
