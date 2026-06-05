import { apiClient } from './client'
import type { Notification, NotificationQuery, UnreadCountResult } from '../types/notification'
import type { PaginatedResponse } from '../types/company'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const notificationsApi = {
  list: async (query: NotificationQuery): Promise<PaginatedResponse<Notification>> => {
    const res = await apiClient.get('/notifications', { params: query })
    return res.data as PaginatedResponse<Notification>
  },

  getUnreadCount: async (): Promise<UnreadCountResult> => {
    const res = await apiClient.get('/notifications/unread-count')
    return unwrap<UnreadCountResult>(res)
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const res = await apiClient.post(`/notifications/${id}/read`)
    return unwrap<Notification>(res)
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/read-all')
  },
}
