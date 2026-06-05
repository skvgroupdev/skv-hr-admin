import { useQuery } from '@tanstack/react-query'
import { payrollApi } from '../../api/payroll.api'

type AllPayslipsParams = {
  page: number
  limit: number
  sort?: string
  periodId?: string
  status?: string
  search?: string
  startDate?: string
  endDate?: string
}

export const usePayrollPeriodsQuery = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['payroll', 'periods', { page, limit }],
    queryFn: () => payrollApi.listPeriods(page, limit),
    staleTime: 30_000,
  })
}

export const usePayrollPeriodQuery = (id: string) => {
  return useQuery({
    queryKey: ['payroll', 'periods', id],
    queryFn: () => payrollApi.getPeriod(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

export const usePeriodPayslipsQuery = (periodId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['payroll', 'periods', periodId, 'payslips', { page, limit }],
    queryFn: () => payrollApi.getPeriodPayslips(periodId, page, limit),
    staleTime: 30_000,
    enabled: !!periodId,
  })
}

export const useAllPayslipsQuery = (params: AllPayslipsParams) => {
  return useQuery({
    queryKey: ['payroll', 'payslips', params],
    queryFn: () => payrollApi.getAllPayslips(params),
    staleTime: 30_000,
  })
}

export const useEmployeePayslipsQuery = (
  employeeId: string,
  params: { page: number; limit: number },
) => {
  return useQuery({
    queryKey: ['payroll', 'employees', employeeId, 'payslips', params],
    queryFn: () => payrollApi.getEmployeePayslips(employeeId, params),
    staleTime: 30_000,
    enabled: !!employeeId,
  })
}

export const useEmployeeFinanceSummaryQuery = (employeeId: string) => {
  return useQuery({
    queryKey: ['payroll', 'employees', employeeId, 'finance-summary'],
    queryFn: () => payrollApi.getEmployeeFinanceSummary(employeeId),
    staleTime: 60_000,
    enabled: !!employeeId,
  })
}

export const usePayslipDetailQuery = (payslipId?: string) => {
  return useQuery({
    queryKey: ['payroll', 'payslips', payslipId],
    queryFn: () => payrollApi.getPayslipById(payslipId!),
    staleTime: 30_000,
    enabled: !!payslipId,
  })
}

export const usePayrollReportQuery = (periodId?: string) => {
  return useQuery({
    queryKey: ['payroll', 'report', periodId],
    queryFn: () => payrollApi.getReport(periodId!),
    staleTime: 60_000,
    enabled: !!periodId,
  })
}
