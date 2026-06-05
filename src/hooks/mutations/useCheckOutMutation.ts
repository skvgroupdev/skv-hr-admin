import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeAttendanceApi, type CheckInOutData } from '../../api/employee-attendance.api'

export const useCheckOutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CheckInOutData) => employeeAttendanceApi.checkOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] })
      queryClient.invalidateQueries({ queryKey: ['attendance', 'history'] })
    },
  })
}
