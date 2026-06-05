import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeProfileApi, type UpdateMyProfileData } from '../../api/employee-profile.api'

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateMyProfileData) => employeeProfileApi.updateMyProfile(data),
    onSuccess: () => {
      // invalidate ['auth', 'me'] → ProfilePage's useQuery refetches and calls setUser with full User object
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}
