import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeRequestsApi } from '../../api/employee-requests.api'

export const useCancelLeaveMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeRequestsApi.cancelLeave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave', 'my'] })
      queryClient.invalidateQueries({ queryKey: ['leave', 'balance'] })
    },
  })
}
