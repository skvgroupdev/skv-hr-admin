import { ChevronRight, Clock } from 'lucide-react'
import { useAnnouncementFeedQuery } from '../../../hooks/queries/useEmployeeNotificationsQuery'
import { formatDate } from '../../../utils/date'

function AnnouncementSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded-2xl" />
      ))}
    </div>
  )
}

interface AnnouncementItemProps {
  title: string
  content: string
  createdAt?: string
}

function AnnouncementItem({ title, content, createdAt }: AnnouncementItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border-l-4 border-[#1A3A6B] hover:bg-blue-50/50 transition-colors cursor-pointer flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{content}</p>
        {createdAt && (
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(createdAt)}
          </p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
    </div>
  )
}

export function AnnouncementFeed() {
  const { data: announcements, isLoading } = useAnnouncementFeedQuery()

  if (isLoading) {
    return (
      <div className="px-4 pb-4">
        <div className="h-4 w-24 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded mb-3" />
        <AnnouncementSkeleton />
      </div>
    )
  }

  if (!announcements?.length) return null

  return (
    <div className="px-4 pb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3">ປະກາດລ່າສຸດ</h3>
      <div className="space-y-2">
        {announcements.slice(0, 3).map((item) => (
          <AnnouncementItem
            key={item.id}
            title={item.title}
            content={item.content}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </div>
  )
}
