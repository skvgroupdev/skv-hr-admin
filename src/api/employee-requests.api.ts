import { apiClient } from './client'

export interface LeaveType {
  id: string
  name: string
  maxDaysPerYear: number
}

export interface LeaveBalance {
  leaveTypeId: string
  leaveTypeName: string
  total: number
  used: number
  remaining: number
}

export interface SubmitLeaveDto {
  leaveTypeName: string
  startDate: string
  endDate: string
  isHalfDay: boolean
  halfDayPeriod?: 'AM' | 'PM'
  reason: string
}

export interface SubmitOTDto {
  date: string
  startTime: string
  endTime: string
  reason: string
}

export interface SubmitOutsideWorkDto {
  outsideType: 'OUTSIDE_WORK' | 'CUSTOMER_VISIT' | 'DELIVERY' | 'WORK_FROM_HOME' | 'BUSINESS_TRIP' | 'EMERGENCY' | 'OTHER'
  reason: string
  locationName?: string
  lat?: number
  lng?: number
  gpsAccuracy?: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export const employeeRequestsApi = {
  // Leave
  getLeaveTypes: () =>
    apiClient.get<{ data: LeaveType[] }>('/leave-types').then((r) => r.data.data),

  submitLeave: (dto: SubmitLeaveDto) =>
    apiClient.post('/leave/request', dto).then((r) => r.data),

  getMyLeaves: (params: PaginationParams) =>
    apiClient.get('/leave/my', { params }).then((r) => r.data),

  getMyLeaveBalance: () =>
    apiClient.get<{ data: LeaveBalance[] }>('/leave/balance/my').then((r) => r.data.data),

  cancelLeave: (id: string) =>
    apiClient.post(`/leave/${id}/cancel`).then((r) => r.data),

  // OT
  submitOT: (dto: SubmitOTDto) =>
    apiClient.post('/ot/request', dto).then((r) => r.data),

  getMyOTs: (params: PaginationParams) =>
    apiClient.get('/ot/my', { params }).then((r) => r.data),

  // Outside Work
  submitOutsideWork: (dto: SubmitOutsideWorkDto) =>
    apiClient.post('/outside-work/request', dto).then((r) => r.data),

  getMyOutsideWork: (params: PaginationParams) =>
    apiClient.get('/outside-work/my', { params }).then((r) => r.data),
}
