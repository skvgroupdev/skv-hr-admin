import { useEmployeeNotificationsQuery } from '../../../hooks/queries/useEmployeeNotificationsQuery'
import { useMarkNotificationReadM, useMarkAllNotificationsReadM } from '../../../hooks/mutations/useNotificationMutations'
import type { Notification, NotificationType } from '../../../types/notification'

const TYPE_ICON: Record<NotificationType, string> = {
  LEAVE_REQUEST: '📅',
  LEAVE_APPROVED: '📅',
  LEAVE_REJECTED: '📅',
  OT_REQUEST: '⏰',
  OT_APPROVED: '⏰',
  OT_REJECTED: '⏰',
  OUTSIDE_WORK_REQUEST: '📍',
  OUTSIDE_WORK_APPROVED: '📍',
  OUTSIDE_WORK_REJECTED: '📍',
  ATTENDANCE_LATE: '⚠️',
  PAYROLL_RELEASED: '💰',
  ANNOUNCEMENT: '📢',
  SUBSCRIPTION_EXPIRING: '🔔',
}

function formatDate7(isoString: string): string {
  const date = new Date(isoString)
  // UTC+7
  const utc7 = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  const day = String(utc7.getUTCDate()).padStart(2, '0')
  const month = String(utc7.getUTCMonth() + 1).padStart(2, '0')
  const year = utc7.getUTCFullYear()
  const hour = String(utc7.getUTCHours()).padStart(2, '0')
  const min = String(utc7.getUTCMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hour}:${min}`
}

function NotificationSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const icon = TYPE_ICON[notification.type] ?? '🔔'

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkRead(notification.id)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left rounded-xl px-4 py-3 shadow-sm flex items-start gap-3 active:opacity-80 transition-opacity ${
        notification.isRead
          ? 'bg-white'
          : 'bg-blue-50 border-l-4 border-blue-500'
      }`}
    >
      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm flex-1 truncate ${
              notification.isRead ? 'text-gray-600' : 'font-semibold text-gray-800'
            }`}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{notification.body}</p>
        <p className="text-xs text-gray-300 mt-1">{formatDate7(notification.createdAt)}</p>
      </div>
    </button>
  )
}

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useEmployeeNotificationsQuery()
  const markRead = useMarkNotificationReadM()
  const markAllRead = useMarkAllNotificationsReadM()

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0
  const hasUnread = unreadCount > 0

  const handleMarkRead = (id: string) => {
    markRead.mutate(id)
  }

  const handleMarkAllRead = () => {
    markAllRead.mutate()
  }

  return (
    <div>
      <div className="bg-[#0D2B6B] text-white px-5 pt-4 pb-4 flex items-center justify-between">
        <p className="text-lg font-bold">ການແຈ້ງເຕືອນ</p>
        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending}
            className="text-xs bg-white/20 px-3 py-1.5 rounded-full active:opacity-70 disabled:opacity-50"
          >
            ອ່ານທັງໝົດ
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-2">
        {isLoading && <NotificationSkeleton />}

        {!isLoading && !notifications?.length && (
          <p className="text-center text-gray-400 text-sm mt-8">ຍັງບໍ່ມີການແຈ້ງເຕືອນ</p>
        )}

        {notifications?.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={handleMarkRead}
          />
        ))}
      </div>
    </div>
  )
}
