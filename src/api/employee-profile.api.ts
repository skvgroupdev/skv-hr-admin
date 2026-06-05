import { apiClient } from './client'
import type { User } from '../types/auth'

export interface UpdateMyProfileData {
  firstName?: string
  lastName?: string
  email?: string
  address?: string
  photoUrl?: string
  bankName?: string
  bankAccount?: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

export const employeeProfileApi = {
  updateMyProfile: (data: UpdateMyProfileData): Promise<User> =>
    apiClient
      .patch<{ data: User }>('/employees/me', data)
      .then((r) => r.data.data),

  changePassword: (data: ChangePasswordData): Promise<void> =>
    apiClient.post('/auth/change-password', data).then(() => undefined),
}
