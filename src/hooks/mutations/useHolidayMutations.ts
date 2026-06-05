import { useMutation, useQueryClient } from '@tanstack/react-query'
import { holidaysApi } from '../../api/holidays.api'
import type { CreateHolidayDto, UpdateHolidayDto } from '../../types/holiday'

export const useCreateHolidayMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateHolidayDto) => holidaysApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['holidays'] }) },
  })
}

export const useUpdateHolidayMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateHolidayDto }) => holidaysApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['holidays'] }) },
  })
}

export const useDeleteHolidayMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => holidaysApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['holidays'] }) },
  })
}
