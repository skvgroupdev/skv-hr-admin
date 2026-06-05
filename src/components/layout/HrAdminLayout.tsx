import { Outlet } from 'react-router-dom'
import { HrSidebar } from './HrSidebar'
import { TopBar } from './TopBar'
import { Footer } from './Footer'

export function HrAdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <HrSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
