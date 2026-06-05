import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LogOut, Camera } from 'lucide-react'
import { useAuthStore } from '../../../stores/useAuthStore'
import { useUpdateMyProfileMutation } from '../../../hooks/mutations/useUpdateMyProfileMutation'
import { uploadApi } from '../../../api/upload.api'
import { authApi } from '../../../api/auth.api'
import type { Role, User } from '../../../types/auth'
import { ProfileInfoList } from './ProfileInfoList'
import { BankInfoTab } from './BankInfoTab'
import { ChangePasswordTab } from './ChangePasswordTab'

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'ຜູ້ດູແລລະບົບ',
  COMPANY_OWNER: 'ເຈົ້າຂອງບໍລິສັດ',
  HR_ADMIN: 'HR',
  BRANCH_MANAGER: 'ຜູ້ຈັດການສາຂາ',
  SUPERVISOR: 'ຫົວໜ້າ',
  STAFF: 'ພະນັກງານ',
}

type Tab = 'bank' | 'password'
const TABS: { id: Tab; label: string }[] = [
  { id: 'bank', label: 'ທະນາຄານ' },
  { id: 'password', label: 'ປ່ຽນລະຫັດຜ່ານ' },
]

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const storedUser = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const [activeTab, setActiveTab] = useState<Tab>('bank')
  const [uploading, setUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const mutation = useUpdateMyProfileMutation()

  const { data: freshUser, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me() as Promise<User>,
    enabled: !!storedUser,
    staleTime: 0,
  })

  useEffect(() => {
    if (freshUser) setUser(freshUser)
  }, [freshUser, setUser])

  const user = freshUser ?? storedUser

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadApi.uploadFile(file, 'profile')
      mutation.mutate({ photoUrl: url })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // No user at all (not logged in) — ProtectedRoute should have caught this
  if (!user) return null

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header card — always shown using storedUser as fallback */}
      <div className="bg-[#0D2B6B] rounded-2xl p-5 flex items-center gap-4 text-white">
        <div className="relative shrink-0">
          <div className="h-14 w-14 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-lg font-bold">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow disabled:opacity-50"
          >
            {uploading ? (
              <svg className="h-3 w-3 animate-spin text-[#0D2B6B]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <Camera className="h-3 w-3 text-[#0D2B6B]" />
            )}
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>
        <div>
          <p className="font-bold text-base">{user.name}</p>
          <p className="text-xs opacity-70 mt-0.5">{ROLE_LABELS[user.role]}</p>
        </div>
      </div>

      {/* Skeleton while fetching fresh data for the first time after login */}
      {isLoading && !freshUser && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>
      )}

      {/* Read-only info */}
      {(!isLoading || freshUser) && <ProfileInfoList user={user} />}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#0D2B6B] text-[#0D2B6B]'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 'bank' && <BankInfoTab user={user} />}
          {activeTab === 'password' && <ChangePasswordTab />}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full min-h-12 rounded-2xl border-2 border-red-500 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 active:opacity-80"
      >
        <LogOut className="h-4 w-4" />
        ອອກຈາກລະບົບ
      </button>
    </div>
  )
}
