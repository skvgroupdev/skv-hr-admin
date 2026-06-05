import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leaveApi } from '../../api/leave.api'

export const useApproveLeaveM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      leaveApi.approve(id, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave'] })
    },
  })
}

export const useRejectLeaveM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      leaveApi.reject(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave'] })
    },
  })
}
