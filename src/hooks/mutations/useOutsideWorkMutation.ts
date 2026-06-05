import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeRequestsApi, type SubmitOutsideWorkDto } from '../../api/employee-requests.api'

export const useOutsideWorkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SubmitOutsideWorkDto) => employeeRequestsApi.submitOutsideWork(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outside-work', 'my'] })
    },
  })
}
