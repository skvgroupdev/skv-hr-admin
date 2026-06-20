export type PayrollPeriodStatus = 'DRAFT' | 'GENERATED' | 'HR_REVIEWED' | 'PAID' | 'APPROVED' | 'LOCKED'
export type PayslipStatus = 'DRAFT' | 'HR_REVIEWED' | 'PAID' | 'APPROVED'

export interface PayslipEmployee {
  id: string
  firstName: string
  lastName: string
  employeeCode: string
  positionId?: { id: string; name: string }
  departmentId?: { id: string; name: string }
}

export interface PayslipPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
}

export interface PayrollPeriod {
  id: string
  tenantId: string
  name: string
  startDate: string
  endDate: string
  status: PayrollPeriodStatus
  generatedBy?: string
  approvedBy?: string
  lockedBy?: string
  hrReviewedBy?: string
  hrReviewedAt?: string
  paidBy?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface PayslipAllowance {
  name: string
  amount: number
}

export interface PayslipDeduction {
  name: string
  amount: number
}

export interface PayrollAdjustment {
  kind: 'ADDITION' | 'DEDUCTION'
  name: string
  amount: number
  reason: string
  source: 'SYSTEM' | 'MANUAL' | 'PREVIOUS_PERIOD_CORRECTION'
  createdBy?: string
  createdAt: string
}

export interface Payslip {
  id: string
  tenantId: string
  payrollPeriodId: string | PayslipPeriod
  employeeId: string | PayslipEmployee
  baseSalary: number
  allowances: PayslipAllowance[]
  otHours: number
  otAmount: number
  grossSalary: number
  employeeSsAmount: number
  taxableIncome: number
  incomeTax: number
  otherDeductions: PayslipDeduction[]
  totalDeductions: number
  netSalary: number
  employerSsAmount: number
  approvedRestDays?: number
  unusedRestDays?: number
  restDayCompensationAmount?: number
  adjustments?: PayrollAdjustment[]
  status: PayslipStatus
  createdAt: string
  // Populated fields returned from backend when requested
  employee?: PayslipEmployee
  period?: PayslipPeriod
}

export interface CreatePayrollPeriodDto {
  name: string
  startDate: string
  endDate: string
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedPayrollPeriods {
  data: PayrollPeriod[]
  meta: PaginatedMeta
}

export interface PaginatedPayslips {
  data: Payslip[]
  meta: PaginatedMeta
}

export interface PayslipWithEmployee extends Payslip {
  employee: { id: string; firstName: string; lastName: string; employeeCode: string }
}

export interface PaginatedPayslipsWithEmployee {
  data: PayslipWithEmployee[]
  meta: PaginatedMeta
}

export interface PayrollReport {
  periodId: string
  totalGrossSalary: number
  totalNetSalary: number
  totalEmployeeSsAmount: number
  totalEmployerSsAmount: number
  totalIncomeTax: number
  totalOtAmount: number
  totalAllowances: number
  totalLeaveDeductions: number
  totalOtherDeductions: number
  payslipCount: number
  approvedCount: number
}

// Helper: get employee name from a payslip regardless of whether employeeId is populated
export function getEmployeeName(payslip: Payslip): string {
  if (typeof payslip.employeeId === 'object' && payslip.employeeId !== null) {
    return `${payslip.employeeId.firstName} ${payslip.employeeId.lastName}`
  }
  if (payslip.employee) {
    return `${payslip.employee.firstName} ${payslip.employee.lastName}`
  }
  return '-'
}

// Helper: get raw employeeId string regardless of populated or not
export function getEmployeeIdString(payslip: Payslip): string {
  if (typeof payslip.employeeId === 'object' && payslip.employeeId !== null) {
    return payslip.employeeId.id
  }
  return payslip.employeeId
}

export interface EmployeeFinanceSummary {
  totalPayslips: number
  totalNetSalary: number
  totalGrossSalary: number
  averageNetSalary: number
  monthlyBreakdown: {
    year: number
    month: number
    netSalary: number
    grossSalary: number
  }[]
}
