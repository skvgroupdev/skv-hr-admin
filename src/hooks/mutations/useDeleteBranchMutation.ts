import { useMutation, useQueryClient } from '@tanstack/react-query'
import { branchesApi } from '../../api/branches.api'

export const useDeleteBranchMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => branchesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}
