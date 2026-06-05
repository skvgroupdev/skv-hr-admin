import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../../api/notifications.api'
import type { NotificationQuery } from '../../types/notification'

export const useNotificationsQuery = (query: NotificationQuery = {}) => {
  return useQuery({
    queryKey: ['notifications', query],
    queryFn: () => notificationsApi.list(query),
    staleTime: 30_000,
  })
}

export const useNotificationUnreadCountQuery = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
