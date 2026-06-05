import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'

export const useDeactivateEmployeeMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeesApi.deactivate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employees', id] })
    },
  })
}

export const useReactivateEmployeeMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeesApi.reactivate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employees', id] })
    },
  })
}
