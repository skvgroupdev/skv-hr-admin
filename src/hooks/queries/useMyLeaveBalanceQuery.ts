import { useQuery } from '@tanstack/react-query'
import { employeeRequestsApi } from '../../api/employee-requests.api'

export const useMyLeaveBalanceQuery = () =>
  useQuery({
    queryKey: ['leave', 'balance'],
    queryFn: () => employeeRequestsApi.getMyLeaveBalance(),
    staleTime: 5 * 60_000,
  })
