import { HomeHeader } from './HomeHeader'
import { AttendanceStatusCard } from './AttendanceStatusCard'
import { HomeMenuGrid } from './HomeMenuGrid'
import { AnnouncementFeed } from './AnnouncementFeed'
import { useMyTodayAttendanceQuery } from '../../../hooks/queries/useMyTodayAttendanceQuery'
import { useBackgroundLocation } from '../../../hooks/useBackgroundLocation'

export default function HomePage() {
  const { data: todayRecord, isLoading } = useMyTodayAttendanceQuery()

  // Start background location tracking as soon as employee lands on home
  useBackgroundLocation()

  return (
    <div className="bg-employee-bg min-h-screen">
      <HomeHeader />
      <AttendanceStatusCard record={todayRecord} isLoading={isLoading} />
      <HomeMenuGrid />
      <AnnouncementFeed />
    </div>
  )
}
