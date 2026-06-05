import { useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentsApi } from '../../api/departments.api'

export const useDeleteDepartmentMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => departmentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}
