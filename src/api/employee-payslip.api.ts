import { apiClient } from './client'

export interface PayslipSummary {
  id: string
  month: number
  year: number
  netSalary: number
  status: 'DRAFT' | 'APPROVED' | 'PAID'
}

export interface PayslipAllowance {
  name: string
  amount: number
}

export interface PayslipDetail extends PayslipSummary {
  baseSalary: number
  otHours: number
  otAmount: number
  grossSalary: number
  allowances: PayslipAllowance[]
  employeeSsAmount: number
  incomeTax: number
  otherDeductions: Array<{ name: string; amount: number }>
  totalDeductions: number
}

export const employeePayslipApi = {
  getMyPayslips: () =>
    apiClient.get<{ data: any[] }>('/payroll/my-payslips').then((r) =>
      r.data.data.map((p) => ({
        id: p.id,
        month: new Date(p.createdAt).getMonth() + 1,
        year: new Date(p.createdAt).getFullYear(),
        netSalary: p.netSalary,
        status: p.status,
      } as PayslipSummary))
    ),

  getMyPayslipDetail: (id: string) =>
    apiClient.get<{ data: any }>(`/payroll/my-payslips/${id}`).then((r) => {
      const p = r.data.data
      return {
        id: p.id,
        month: new Date(p.createdAt).getMonth() + 1,
        year: new Date(p.createdAt).getFullYear(),
        netSalary: p.netSalary,
        status: p.status,
        baseSalary: p.baseSalary,
        otHours: p.otHours,
        otAmount: p.otAmount,
        grossSalary: p.grossSalary,
        allowances: p.allowances,
        employeeSsAmount: p.employeeSsAmount,
        incomeTax: p.incomeTax,
        otherDeductions: p.otherDeductions ?? [],
        totalDeductions: p.totalDeductions,
      } as PayslipDetail
    }),
}
