import { useMutation } from '@tanstack/react-query'
import { employeeProfileApi, type ChangePasswordData } from '../../api/employee-profile.api'

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: (data: ChangePasswordData) => employeeProfileApi.changePassword(data),
  })
