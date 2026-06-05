import { useMutation, useQueryClient } from '@tanstack/react-query'
import { payrollApi } from '../../api/payroll.api'
import type { CreatePayrollPeriodDto } from '../../types/payroll'

export const useCreatePayrollPeriodMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreatePayrollPeriodDto) => payrollApi.createPeriod(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payroll', 'periods'] }) },
  })
}

export const useGeneratePayrollMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payrollApi.generate(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payroll', 'periods'] }) },
  })
}

export const useApprovePayrollMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payrollApi.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payroll', 'periods'] }) },
  })
}

export const useLockPayrollMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payrollApi.lock(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payroll', 'periods'] }) },
  })
}
