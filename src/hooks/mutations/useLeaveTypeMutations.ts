import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leaveApi } from '../../api/leave.api'
import type { CreateLeaveTypeDto } from '../../types/leave'

export const useCreateLeaveTypeMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateLeaveTypeDto) => leaveApi.createType(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-types'] }) },
  })
}

export const useUpdateLeaveTypeMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateLeaveTypeDto> }) =>
      leaveApi.updateType(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-types'] }) },
  })
}

export const useDeleteLeaveTypeMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => leaveApi.deleteType(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-types'] }) },
  })
}
