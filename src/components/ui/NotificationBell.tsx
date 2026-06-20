import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useNotificationsQuery, useNotificationUnreadCountQuery } from '../../hooks/queries/useNotificationsQuery'
import { notificationsApi } from '../../api/notifications.api'
import { formatDateOnly } from '../../utils/date'
import type { Notification } from '../../types/notification'

interface Props {
  // Incremented externally by socket to trigger badge bump before refetch settles
  socketUnreadBump?: number
}

function NotificationRow({
  item,
  onRead,
}: {
  item: Notification
  onRead: (id: string) => void
}) {
  return (
    <button
      onClick={() => !item.isRead && onRead(item.id)}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50 ${
        item.isRead ? 'opacity-60' : ''
      }`}
    >
      <div className="flex gap-2 items-start">
        {!item.isRead && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
        )}
        <div className={!item.isRead ? '' : 'pl-4'}>
          <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.body}</p>
          <p className="text-xs text-gray-400 mt-1">{formatDateOnly(item.createdAt)}</p>
        </div>
      </div>
    </button>
  )
}

export function NotificationBell({ socketUnreadBump = 0 }: Props) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: unreadData } = useNotificationUnreadCountQuery()
  const { data: notifData, isLoading } = useNotificationsQuery({ limit: 15 })

  // socketUnreadBump adds optimistic badge increment before the server count refreshes
  const serverCount = unreadData?.count ?? 0
  const displayCount = Math.max(serverCount, socketUnreadBump)

  const handleMarkAsRead = async (id: string) => {
    await notificationsApi.markAsRead(id)
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead()
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Refresh count + list when dropdown opens
  useEffect(() => {
    if (open) {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  }, [open, queryClient])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        aria-label="ການແຈ້ງເຕືອນ"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {displayCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {displayCount > 9 ? '9+' : displayCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">ການແຈ້ງເຕືອນ</span>
            {serverCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                ອ່ານທັງໝົດ
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="space-y-2 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            )}

            {!isLoading && !notifData?.data?.length && (
              <p className="py-10 text-center text-sm text-gray-400">ບໍ່ມີການແຈ້ງເຕືອນ</p>
            )}

            {notifData?.data?.map((item: Notification) => (
              <NotificationRow key={item.id} item={item} onRead={handleMarkAsRead} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
