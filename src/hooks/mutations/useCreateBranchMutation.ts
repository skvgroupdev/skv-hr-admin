import { useMutation, useQueryClient } from '@tanstack/react-query'
import { branchesApi } from '../../api/branches.api'
import type { CreateBranchDto } from '../../types/branch'

export const useCreateBranchMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBranchDto) => branchesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}
