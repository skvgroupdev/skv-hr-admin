export type NotificationType =
  | 'LEAVE_REQUEST' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED'
  | 'OT_REQUEST' | 'OT_APPROVED' | 'OT_REJECTED'
  | 'OUTSIDE_WORK_REQUEST' | 'OUTSIDE_WORK_APPROVED' | 'OUTSIDE_WORK_REJECTED'
  | 'ATTENDANCE_LATE' | 'PAYROLL_RELEASED' | 'ANNOUNCEMENT' | 'SUBSCRIPTION_EXPIRING'

export interface Notification {
  id: string
  title: string
  body: string
  type: NotificationType
  data?: Record<string, unknown>
  isRead: boolean
  readAt?: string
  createdAt: string
}

export interface NotificationQuery {
  page?: number
  limit?: number
  isRead?: boolean
}

export interface UnreadCountResult {
  count: number
}
