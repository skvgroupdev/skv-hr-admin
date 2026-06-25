import { useMutation } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'

export const useHrChangePasswordMutation = () =>
  useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      employeesApi.changePassword(id, { newPassword }),
  })
