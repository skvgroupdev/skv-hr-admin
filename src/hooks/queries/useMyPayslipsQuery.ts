import { useQuery } from '@tanstack/react-query'
import { employeePayslipApi } from '../../api/employee-payslip.api'

export const useMyPayslipsQuery = () =>
  useQuery({
    queryKey: ['payslips', 'my'],
    queryFn: () => employeePayslipApi.getMyPayslips(),
    staleTime: 5 * 60_000,
  })

export const useMyPayslipDetailQuery = (id: string) =>
  useQuery({
    queryKey: ['payslips', 'my', id],
    queryFn: () => employeePayslipApi.getMyPayslipDetail(id),
    staleTime: 10 * 60_000,
    enabled: !!id,
  })
