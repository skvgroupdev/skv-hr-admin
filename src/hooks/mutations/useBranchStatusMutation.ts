import { useMutation, useQueryClient } from '@tanstack/react-query'
import { branchesApi } from '../../api/branches.api'

export const useActivateBranchMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => branchesApi.activate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['branches'] })
      qc.invalidateQueries({ queryKey: ['branches', id] })
    },
  })
}

export const useDeactivateBranchMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => branchesApi.deactivate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['branches'] })
      qc.invalidateQueries({ queryKey: ['branches', id] })
    },
  })
}
