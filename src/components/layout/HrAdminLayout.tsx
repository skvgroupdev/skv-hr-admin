import { Outlet } from 'react-router-dom'
import { HrSidebar } from './HrSidebar'
import { TopBar } from './TopBar'
import { Footer } from './Footer'
import { SubscriptionBanner } from '../ui/SubscriptionBanner'
import { useAuthStore } from '../../stores/useAuthStore'

export function HrAdminLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex h-screen bg-gray-50">
      <HrSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        {user?.subscriptionSummary && (
          <SubscriptionBanner subscription={user.subscriptionSummary} />
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
