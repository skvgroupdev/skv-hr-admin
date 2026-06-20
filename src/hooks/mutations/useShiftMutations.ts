import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shiftsApi } from '../../api/shifts.api'
import type { CreateShiftDto, UpdateShiftDto, BulkAssignShiftRequest } from '../../types/shift'

export const useCreateShiftMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateShiftDto) => shiftsApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['shifts'] }) },
  })
}

export const useUpdateShiftMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateShiftDto }) => shiftsApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['shifts'] }) },
  })
}

export const useDeleteShiftMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => shiftsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['shifts'] }) },
  })
}

export const useBulkAssignShiftMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: BulkAssignShiftRequest) => shiftsApi.bulkAssignShift(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
