import { useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery'
import { useMarkNotificationReadM, useMarkAllNotificationsReadM } from '../../../hooks/mutations/useNotificationMutations'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { cn } from '../../../lib/cn'
import type { Notification } from '../../../types/notification'
import { formatDate } from '../../../utils/date'

const TYPE_LABELS: Record<string, string> = {
  LEAVE_REQUEST: 'ຄຳຂໍລາພັກ',
  LEAVE_APPROVED: 'ອນຸມັດລາພັກ',
  LEAVE_REJECTED: 'ປະຕິເສດລາພັກ',
  OT_REQUEST: 'ຄຳຂໍ OT',
  OT_APPROVED: 'ອນຸມັດ OT',
  OT_REJECTED: 'ປະຕິເສດ OT',
  OUTSIDE_WORK_REQUEST: 'ຄຳຂໍອອກນອກ',
  OUTSIDE_WORK_APPROVED: 'ອນຸມັດອອກນອກ',
  OUTSIDE_WORK_REJECTED: 'ປະຕິເສດອອກນອກ',
  ATTENDANCE_LATE: 'ເຂົ້າວຽກຊ້າ',
  PAYROLL_RELEASED: 'ອອກເງິນເດືອນ',
  ANNOUNCEMENT: 'ປະກາດ',
  SUBSCRIPTION_EXPIRING: 'ໃກ້ໝົດສັນຍາ',
}

function NotificationRow({ notification }: { notification: Notification }) {
  const markRead = useMarkNotificationReadM()

  return (
    <div
      className={cn(
        'flex items-start gap-4 border-b border-gray-100 px-4 py-4 transition-colors',
        !notification.isRead && 'bg-blue-50/50',
      )}
    >
      <div className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', notification.isRead ? 'bg-gray-300' : 'bg-blue-500')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {TYPE_LABELS[notification.type] ?? notification.type}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="mt-0.5 text-sm text-gray-600">{notification.body}</p>
      </div>
      {!notification.isRead && (
        <Button
          size="sm"
          variant="ghost"
          loading={markRead.isPending}
          onClick={() => markRead.mutate(notification.id)}
        >
          ອ່ານແລ້ວ
        </Button>
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [filterRead, setFilterRead] = useState<string>('')
  const markAll = useMarkAllNotificationsReadM()

  const isReadParam = filterRead === 'unread' ? false : filterRead === 'read' ? true : undefined
  const { data, isLoading } = useNotificationsQuery({ page, limit: 20, isRead: isReadParam })

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          ການແຈ້ງເຕືອນ
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={filterRead}
            onChange={(e) => { setFilterRead(e.target.value); setPage(1) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">ທັງໝົດ</option>
            <option value="unread">ຍັງບໍ່ໄດ້ອ່ານ</option>
            <option value="read">ອ່ານແລ້ວ</option>
          </select>
          <Button
            variant="ghost"
            loading={markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            <CheckCheck className="h-4 w-4" />
            ອ່ານທັງໝົດ
          </Button>
        </div>
      </div>

      <Card padding={false}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-gray-100 px-4 py-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))
        ) : data?.data.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">ບໍ່ມີການແຈ້ງເຕືອນ</p>
        ) : (
          data?.data.map((n) => <NotificationRow key={n.id} notification={n} />)
        )}
        {data?.meta && (
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  )
}
