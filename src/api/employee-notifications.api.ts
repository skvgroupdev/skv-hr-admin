import { apiClient } from './client'
import type { Notification } from '../types/notification'

export interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
}

export const employeeNotificationsApi = {
  getNotifications: () =>
    apiClient.get<{ data: Notification[] }>('/notifications').then((r) => r.data.data),

  getUnreadCount: () =>
    apiClient.get<{ data: { count: number } }>('/notifications/unread-count').then((r) => r.data.data),

  markRead: (id: string) =>
    apiClient.post(`/notifications/${id}/read`).then((r) => r.data),

  getAnnouncementFeed: () =>
    apiClient.get<{ data: Announcement[] }>('/announcements/mobile/feed').then((r) => r.data.data),
}
