import { useMutation, useQueryClient } from '@tanstack/react-query'
import { otApi } from '../../api/ot.api'
import type { UpdateOTPolicyDto } from '../../types/ot'

export const useUpdateOTPolicyMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateOTPolicyDto) => otApi.updatePolicy(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ot', 'policy'] }) },
  })
}

export const useApproveOTMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      otApi.approve(id, comment),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ot'] }) },
  })
}

export const useRejectOTMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      otApi.reject(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ot'] }) },
  })
}
