import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeRequestsApi, type SubmitOTDto } from '../../api/employee-requests.api'

export const useOTRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SubmitOTDto) => employeeRequestsApi.submitOT(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ot', 'my'] })
    },
  })
}
