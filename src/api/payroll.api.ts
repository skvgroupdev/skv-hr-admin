import { apiClient } from './client'
import type {
  PayrollPeriod,
  Payslip,
  CreatePayrollPeriodDto,
  PaginatedPayrollPeriods,
  PaginatedPayslips,
  PaginatedPayslipsWithEmployee,
  EmployeeFinanceSummary,
  PayrollReport,
} from '../types/payroll'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const payrollApi = {
  createPeriod: async (body: CreatePayrollPeriodDto): Promise<PayrollPeriod> => {
    const res = await apiClient.post('/payroll/periods', body)
    return unwrap<PayrollPeriod>(res)
  },

  listPeriods: async (page = 1, limit = 20): Promise<PaginatedPayrollPeriods> => {
    const res = await apiClient.get('/payroll/periods', { params: { page, limit } })
    return res.data as PaginatedPayrollPeriods
  },

  getPeriod: async (id: string): Promise<PayrollPeriod> => {
    const res = await apiClient.get(`/payroll/periods/${id}`)
    return unwrap<PayrollPeriod>(res)
  },

  generate: async (id: string): Promise<PayrollPeriod> => {
    const res = await apiClient.post(`/payroll/periods/${id}/generate`)
    return unwrap<PayrollPeriod>(res)
  },

  approve: async (id: string): Promise<PayrollPeriod> => {
    const res = await apiClient.post(`/payroll/periods/${id}/approve`)
    return unwrap<PayrollPeriod>(res)
  },

  lock: async (id: string): Promise<PayrollPeriod> => {
    const res = await apiClient.post(`/payroll/periods/${id}/lock`)
    return unwrap<PayrollPeriod>(res)
  },

  getPeriodPayslips: async (id: string, page = 1, limit = 20): Promise<PaginatedPayslips> => {
    const res = await apiClient.get(`/payroll/periods/${id}/payslips`, { params: { page, limit } })
    return res.data as PaginatedPayslips
  },

  getAllPayslips: async (params: {
    page: number
    limit: number
    sort?: string
    periodId?: string
    status?: string
    search?: string
    startDate?: string
    endDate?: string
  }): Promise<PaginatedPayslipsWithEmployee> => {
    const res = await apiClient.get('/payroll/payslips', { params })
    return res.data as PaginatedPayslipsWithEmployee
  },

  getEmployeePayslips: async (
    employeeId: string,
    params: { page: number; limit: number },
  ): Promise<PaginatedPayslips> => {
    const res = await apiClient.get(`/payroll/employees/${employeeId}/payslips`, { params })
    return res.data as PaginatedPayslips
  },

  getEmployeeFinanceSummary: async (employeeId: string): Promise<EmployeeFinanceSummary> => {
    const res = await apiClient.get(`/payroll/employees/${employeeId}/finance-summary`)
    return unwrap<EmployeeFinanceSummary>(res)
  },

  getPayslipById: async (id: string): Promise<Payslip> => {
    const res = await apiClient.get(`/payroll/payslips/${id}`)
    return unwrap<Payslip>(res)
  },

  getReport: async (periodId: string): Promise<PayrollReport> => {
    const res = await apiClient.get('/payroll/report', { params: { periodId } })
    return unwrap<PayrollReport>(res)
  },
}
