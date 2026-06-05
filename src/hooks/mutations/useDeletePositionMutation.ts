import { useMutation, useQueryClient } from '@tanstack/react-query'
import { positionsApi } from '../../api/positions.api'

export const useDeletePositionMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => positionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['positions'] })
    },
  })
}
