import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../api/notifications.api'

export const useMarkNotificationReadM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllNotificationsReadM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
