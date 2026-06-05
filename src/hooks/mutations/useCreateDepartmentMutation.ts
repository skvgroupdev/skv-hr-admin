import { useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentsApi } from '../../api/departments.api'
import type { CreateDepartmentDto } from '../../types/department'

export const useCreateDepartmentMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateDepartmentDto) => departmentsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}
