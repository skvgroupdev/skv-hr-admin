import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeRequestsApi, type SubmitLeaveDto } from '../../api/employee-requests.api'

export const useLeaveRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SubmitLeaveDto) => employeeRequestsApi.submitLeave(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave', 'my'] })
      queryClient.invalidateQueries({ queryKey: ['leave', 'balance'] })
    },
  })
}
