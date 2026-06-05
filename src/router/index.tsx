import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { SuperAdminLayout } from '../components/layout/SuperAdminLayout'
import { HrAdminLayout } from '../components/layout/HrAdminLayout'
import { EmployeeLayout } from '../components/layout/EmployeeLayout'
import { PageLoader } from '../components/ui/LoadingSpinner'
import { useAuthStore } from '../stores/useAuthStore'

const LoginPage = lazy(() => import('../features/auth/LoginPage'))
const CompanyListPage = lazy(() => import('../features/super-admin/companies/CompanyListPage'))
const CompanyCreatePage = lazy(() => import('../features/super-admin/companies/CompanyCreatePage'))
const CompanyDetailPage = lazy(() => import('../features/super-admin/companies/CompanyDetailPage'))
const TaxConfigListPage = lazy(() => import('../features/super-admin/tax-configs/TaxConfigListPage'))
const CompanyTaxConfigListPage = lazy(() => import('../features/super-admin/tax-configs/CompanyTaxConfigListPage'))
const PlanListPage = lazy(() => import('../features/super-admin/plans/PlanListPage'))

const DashboardPage = lazy(() => import('../features/hr-admin/dashboard/DashboardPage'))
const BranchListPage = lazy(() => import('../features/hr-admin/branches/BranchListPage'))
const DepartmentListPage = lazy(() => import('../features/hr-admin/departments/DepartmentListPage'))
const PositionListPage = lazy(() => import('../features/hr-admin/positions/PositionListPage'))
const EmployeeListPage = lazy(() => import('../features/hr-admin/employees/EmployeeListPage'))
const EmployeeFormPage = lazy(() => import('../features/hr-admin/employees/EmployeeFormPage'))
const EmployeeDetailPage = lazy(() => import('../features/hr-admin/employees/EmployeeDetailPage'))
const ShiftListPage = lazy(() => import('../features/hr-admin/shifts/ShiftListPage'))
const HolidayListPage = lazy(() => import('../features/hr-admin/holidays/HolidayListPage'))
const AttendancePage = lazy(() => import('../features/hr-admin/attendance/AttendancePage'))
const LeavePage = lazy(() => import('../features/hr-admin/leave/LeavePage'))
const OTPage = lazy(() => import('../features/hr-admin/ot/OTPage'))
const OutsideWorkPage = lazy(() => import('../features/hr-admin/outside-work/OutsideWorkPage'))
const NotificationsPage = lazy(() => import('../features/hr-admin/notifications/NotificationsPage'))
const AnnouncementsPage = lazy(() => import('../features/hr-admin/announcements/AnnouncementsPage'))
const ReportsPage = lazy(() => import('../features/hr-admin/reports/ReportsPage'))
const PayrollPage = lazy(() => import('../features/hr-admin/payroll/PayrollPage'))
const HrTaxConfigPage = lazy(() => import('../features/hr-admin/settings/TaxConfigPage'))
const PayrollPaymentListPage = lazy(() => import('../features/hr-admin/payroll/PayrollPaymentListPage'))
const EmployeeSalaryDetailPage = lazy(() => import('../features/hr-admin/payroll/EmployeeSalaryDetailPage'))
const PayrollReportPage = lazy(() => import('../features/hr-admin/payroll/PayrollReportPage'))

// Employee pages
const EmpHomePage = lazy(() => import('../features/employee/home/HomePage'))
const EmpAttendancePage = lazy(() => import('../features/employee/attendance/AttendancePage'))
const EmpAttendanceHistoryPage = lazy(() => import('../features/employee/attendance/AttendanceHistoryPage'))
const EmpRequestsPage = lazy(() => import('../features/employee/requests/RequestsPage'))
const EmpLeaveRequestPage = lazy(() => import('../features/employee/requests/LeaveRequestPage'))
const EmpOTRequestPage = lazy(() => import('../features/employee/requests/OTRequestPage'))
const EmpOutsideWorkRequestPage = lazy(() => import('../features/employee/requests/OutsideWorkRequestPage'))
const EmpPayslipListPage = lazy(() => import('../features/employee/payslip/PayslipListPage'))
const EmpPayslipDetailPage = lazy(() => import('../features/employee/payslip/PayslipDetailPage'))
const EmpProfilePage = lazy(() => import('../features/employee/profile/ProfilePage'))
const EmpNotificationsPage = lazy(() => import('../features/employee/notifications/NotificationsPage'))

const HR_ROLES = ['COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'] as const
const EMPLOYEE_ROLES = ['STAFF', 'SUPERVISOR', 'BRANCH_MANAGER', 'COMPANY_OWNER', 'HR_ADMIN'] as const

function RoleRedirect() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)

  if (!accessToken) return <Navigate to="/login" replace />
  if (user?.role === 'SUPER_ADMIN') return <Navigate to="/super/companies" replace />
  if (user?.role === 'STAFF') return <Navigate to="/employee/home" replace />
  if (user?.role === 'SUPERVISOR') return <Navigate to="/employee/home" replace />
  if (user?.role === 'BRANCH_MANAGER') return <Navigate to="/employee/home" replace />
  return <Navigate to="/hr/dashboard" replace />
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Wrap><LoginPage /></Wrap>,
  },
  {
    path: '/',
    element: <RoleRedirect />,
  },
  {
    path: '/super',
    element: (
      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
        <SuperAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/super/companies" replace /> },
      { path: 'companies', element: <Wrap><CompanyListPage /></Wrap> },
      { path: 'companies/create', element: <Wrap><CompanyCreatePage /></Wrap> },
      { path: 'companies/:id', element: <Wrap><CompanyDetailPage /></Wrap> },
      { path: 'plans', element: <Wrap><PlanListPage /></Wrap> },
      { path: 'tax-configs', element: <Wrap><TaxConfigListPage /></Wrap> },
      { path: 'company-tax-configs', element: <Wrap><CompanyTaxConfigListPage /></Wrap> },
    ],
  },
  {
    path: '/hr',
    element: (
      <ProtectedRoute allowedRoles={[...HR_ROLES]}>
        <HrAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/hr/dashboard" replace /> },
      { path: 'dashboard', element: <Wrap><DashboardPage /></Wrap> },
      { path: 'branches', element: <Wrap><BranchListPage /></Wrap> },
      { path: 'departments', element: <Wrap><DepartmentListPage /></Wrap> },
      { path: 'positions', element: <Wrap><PositionListPage /></Wrap> },
      { path: 'employees', element: <Wrap><EmployeeListPage /></Wrap> },
      { path: 'employees/create', element: <Wrap><EmployeeFormPage /></Wrap> },
      { path: 'employees/:id', element: <Wrap><EmployeeDetailPage /></Wrap> },
      { path: 'employees/:id/edit', element: <Wrap><EmployeeFormPage /></Wrap> },
      { path: 'shifts', element: <Wrap><ShiftListPage /></Wrap> },
      { path: 'holidays', element: <Wrap><HolidayListPage /></Wrap> },
      { path: 'settings/tax-config', element: <Wrap><HrTaxConfigPage /></Wrap> },
      { path: 'attendance', element: <Wrap><AttendancePage /></Wrap> },
      { path: 'leave', element: <Wrap><LeavePage /></Wrap> },
      { path: 'ot', element: <Wrap><OTPage /></Wrap> },
      { path: 'outside-work', element: <Wrap><OutsideWorkPage /></Wrap> },
      { path: 'notifications', element: <Wrap><NotificationsPage /></Wrap> },
      { path: 'announcements', element: <Wrap><AnnouncementsPage /></Wrap> },
      { path: 'reports', element: <Wrap><ReportsPage /></Wrap> },
      { path: 'payroll', element: <Wrap><PayrollPage /></Wrap> },
      { path: 'payroll/payslips', element: <Wrap><PayrollPaymentListPage /></Wrap> },
      { path: 'payroll/employees/:id', element: <Wrap><EmployeeSalaryDetailPage /></Wrap> },
      { path: 'payroll/report', element: <Wrap><PayrollReportPage /></Wrap> },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={[...EMPLOYEE_ROLES]}>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/employee/home" replace /> },
      { path: 'home', element: <Wrap><EmpHomePage /></Wrap> },
      { path: 'attendance', element: <Wrap><EmpAttendancePage /></Wrap> },
      { path: 'attendance/history', element: <Wrap><EmpAttendanceHistoryPage /></Wrap> },
      { path: 'requests', element: <Wrap><EmpRequestsPage /></Wrap> },
      { path: 'requests/leave', element: <Wrap><EmpLeaveRequestPage /></Wrap> },
      { path: 'requests/ot', element: <Wrap><EmpOTRequestPage /></Wrap> },
      { path: 'requests/outside-work', element: <Wrap><EmpOutsideWorkRequestPage /></Wrap> },
      { path: 'payslip', element: <Wrap><EmpPayslipListPage /></Wrap> },
      { path: 'payslip/:id', element: <Wrap><EmpPayslipDetailPage /></Wrap> },
      { path: 'profile', element: <Wrap><EmpProfilePage /></Wrap> },
      { path: 'notifications', element: <Wrap><EmpNotificationsPage /></Wrap> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-600">Dashboard — Phase 2</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-300">404</h1>
        <p className="text-gray-600">ບໍ່ພົບໜ້ານີ້</p>
      </div>
    ),
  },
])

