import { useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentsApi } from '../../api/departments.api'
import type { UpdateDepartmentDto } from '../../types/department'

interface UpdateDepartmentVars {
  id: string
  body: UpdateDepartmentDto
}

export const useUpdateDepartmentMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: UpdateDepartmentVars) => departmentsApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['departments'] })
      qc.invalidateQueries({ queryKey: ['departments', id] })
    },
  })
}
