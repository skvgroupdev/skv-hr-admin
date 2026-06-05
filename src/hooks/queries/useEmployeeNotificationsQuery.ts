import { useQuery } from '@tanstack/react-query'
import { employeeNotificationsApi } from '../../api/employee-notifications.api'

export const useEmployeeNotificationsQuery = () =>
  useQuery({
    queryKey: ['notifications', 'employee'],
    queryFn: () => employeeNotificationsApi.getNotifications(),
    staleTime: 60_000,
  })

export const useUnreadCountQuery = () =>
  useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => employeeNotificationsApi.getUnreadCount(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

export const useAnnouncementFeedQuery = () =>
  useQuery({
    queryKey: ['announcements', 'feed'],
    queryFn: () => employeeNotificationsApi.getAnnouncementFeed(),
    staleTime: 5 * 60_000,
  })
