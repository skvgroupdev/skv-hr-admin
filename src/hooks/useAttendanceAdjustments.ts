import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { attendanceAdjustmentsApi } from '../api/attendance-adjustments.api'
import type { AttendanceAdjustment } from '../types/attendance-adjustment'

const QUERY_KEY = 'attendance-adjustments'

// ---- Queries ----

export function useMyAdjustmentsQuery() {
  return useQuery<AttendanceAdjustment[]>({
    queryKey: [QUERY_KEY, 'my'],
    queryFn: () => attendanceAdjustmentsApi.mine(),
  })
}

export function useAllAdjustmentsQuery(status?: string) {
  return useQuery<AttendanceAdjustment[]>({
    queryKey: [QUERY_KEY, 'all', status],
    queryFn: () => attendanceAdjustmentsApi.list(status),
  })
}

// ---- Mutations ----

export function useCreateAdjustmentMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof attendanceAdjustmentsApi.create>[0]) =>
      attendanceAdjustmentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useCancelAdjustmentMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attendanceAdjustmentsApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useApproveAdjustmentMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      attendanceAdjustmentsApi.approve(id, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useRejectAdjustmentMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      attendanceAdjustmentsApi.reject(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
