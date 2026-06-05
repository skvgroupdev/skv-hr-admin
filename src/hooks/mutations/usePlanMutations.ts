import { useMutation, useQueryClient } from '@tanstack/react-query'
import { plansApi } from '../../api/plans.api'
import type { CreatePlanDto } from '../../types/plan'

export const useCreatePlanMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreatePlanDto) => plansApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['plans'] }) },
  })
}

export const useUpdatePlanMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreatePlanDto> }) =>
      plansApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['plans'] }) },
  })
}

export const useDeletePlanMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => plansApi.softDelete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['plans'] }) },
  })
}
