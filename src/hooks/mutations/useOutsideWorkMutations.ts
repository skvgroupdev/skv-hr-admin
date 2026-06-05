import { useMutation, useQueryClient } from '@tanstack/react-query'
import { outsideWorkApi } from '../../api/outside-work.api'

export const useApproveOutsideWorkMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      outsideWorkApi.approve(id, comment),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['outside-work'] }) },
  })
}

export const useRejectOutsideWorkMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rejectReason }: { id: string; rejectReason: string }) =>
      outsideWorkApi.reject(id, rejectReason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['outside-work'] }) },
  })
}
