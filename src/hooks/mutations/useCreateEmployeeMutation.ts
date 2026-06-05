import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'
import type { CreateEmployeeDto } from '../../types/employee'

export const useCreateEmployeeMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateEmployeeDto) => employeesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
