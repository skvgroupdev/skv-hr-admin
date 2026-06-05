import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import type { Employee } from '../../types/employee'

interface ChangeRoleVars {
  id: string
  role: string
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const useChangeRoleMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: ChangeRoleVars) =>
      apiClient.patch(`/employees/${id}/role`, { role }).then((r) => unwrap<Employee>(r)),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['employees', id] })
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
