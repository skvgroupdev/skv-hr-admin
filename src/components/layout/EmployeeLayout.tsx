import { Outlet } from 'react-router-dom'
import { EmployeeTopBar } from './EmployeeTopBar'
import { EmployeeBottomNav } from './EmployeeBottomNav'

export function EmployeeLayout() {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-employee-bg">
      <EmployeeTopBar />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <EmployeeBottomNav />
    </div>
  )
}
