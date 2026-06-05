import { useMutation, useQueryClient } from '@tanstack/react-query'
import { positionsApi } from '../../api/positions.api'
import type { UpdatePositionDto } from '../../types/position'

interface UpdatePositionVars {
  id: string
  body: UpdatePositionDto
}

export const useUpdatePositionMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: UpdatePositionVars) => positionsApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['positions'] })
      qc.invalidateQueries({ queryKey: ['positions', id] })
    },
  })
}
