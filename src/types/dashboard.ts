export interface DashboardEmployeeSummary {
  total: number
  active: number
  inactive: number
  probation: number
}

export interface DashboardPendingRequests {
  leave: number
  ot: number
  outsideWork: number
  total: number
}

export interface DashboardBranchSummary {
  total: number
  active: number
}

export interface RecentEmployee {
  id: string
  firstName: string
  lastName: string
  position: string
  branch: string
  status: string
  createdAt: string
}

export interface MonthlyStatItem {
  month: number
  leaveCount: number
  otCount: number
}

export interface DashboardData {
  employees: DashboardEmployeeSummary
  todayAttendance: number
  pendingRequests: DashboardPendingRequests
  branches: DashboardBranchSummary
  recentEmployees: RecentEmployee[]
  monthlyStats: MonthlyStatItem[]
}

export interface DashboardResponse {
  data: DashboardData
}

export interface TodayOverviewEmployee {
  id: string
  firstName: string
  lastName: string
  employeeCode?: string
}

export interface TodayLeaveItem {
  employeeId: string
  employee: TodayOverviewEmployee | null
  status: 'PENDING' | 'APPROVED'
  leaveTypeName: string | null
}

export interface TodayOutsideWorkItem {
  employeeId: string
  employee: TodayOverviewEmployee | null
  status: 'PENDING' | 'APPROVED'
  outsideType: string
}

export interface TodayAdjustmentItem {
  employeeId: string
  employee: TodayOverviewEmployee | null
  status: 'PENDING' | 'APPROVED'
  workDate: string
  type: string
}

export interface TodayOverview {
  leave: TodayLeaveItem[]
  outsideWork: TodayOutsideWorkItem[]
  adjustments: TodayAdjustmentItem[]
}
