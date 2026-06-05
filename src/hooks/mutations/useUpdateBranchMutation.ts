import { useMutation, useQueryClient } from '@tanstack/react-query'
import { branchesApi } from '../../api/branches.api'
import type { UpdateBranchDto } from '../../types/branch'

interface UpdateBranchVars {
  id: string
  body: UpdateBranchDto
}

export const useUpdateBranchMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: UpdateBranchVars) => branchesApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['branches'] })
      qc.invalidateQueries({ queryKey: ['branches', id] })
    },
  })
}
