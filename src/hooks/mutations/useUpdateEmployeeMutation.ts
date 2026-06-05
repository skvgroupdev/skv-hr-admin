import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'
import type { UpdateEmployeeDto } from '../../types/employee'

interface UpdateEmployeeVars {
  id: string
  body: UpdateEmployeeDto
}

export const useUpdateEmployeeMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: UpdateEmployeeVars) => employeesApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employees', id] })
    },
  })
}
