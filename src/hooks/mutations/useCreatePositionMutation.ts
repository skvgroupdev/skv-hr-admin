import { useMutation, useQueryClient } from '@tanstack/react-query'
import { positionsApi } from '../../api/positions.api'
import type { CreatePositionDto } from '../../types/position'

export const useCreatePositionMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreatePositionDto) => positionsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['positions'] })
    },
  })
}
