import { useEmployeeNotificationsQuery } from '../../../hooks/queries/useEmployeeNotificationsQuery'
import { employeeNotificationsApi } from '../../../api/employee-notifications.api'
import { useQueryClient } from '@tanstack/react-query'

export function NotificationList() {
  const queryClient = useQueryClient()
  const { data: notifications, isLoading } = useEmployeeNotificationsQuery()

  const handleMarkRead = async (id: string) => {
    await employeeNotificationsApi.markRead(id)
    queryClient.invalidateQueries({ queryKey: ['notifications', 'employee'] })
    queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
  }

  if (isLoading) return <div className="h-20 animate-pulse bg-white rounded-2xl" />

  return (
    <div className="space-y-2">
      {notifications?.slice(0, 10).map((n) => (
        <button
          key={n.id}
          onClick={() => !n.isRead && handleMarkRead(n.id)}
          className={`w-full text-left bg-white rounded-xl px-4 py-3 shadow-sm border-l-4 ${
            n.isRead ? 'border-transparent' : 'border-[#0D2B6B]'
          }`}
        >
          <p className={`text-sm ${n.isRead ? 'text-gray-500' : 'font-medium text-gray-800'}`}>
            {n.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{n.message}</p>
        </button>
      ))}
      {!notifications?.length && (
        <p className="text-center text-gray-400 text-sm py-4">ບໍ່ມີການແຈ້ງເຕືອນ</p>
      )}
    </div>
  )
}
