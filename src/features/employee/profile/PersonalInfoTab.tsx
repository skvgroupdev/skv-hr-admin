import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileUpload } from '../../../components/ui/FileUpload'
import { useUpdateMyProfileMutation } from '../../../hooks/mutations/useUpdateMyProfileMutation'
import { toast } from '../../../components/ui/Toast'
import type { User } from '../../../types/auth'

const schema = z.object({
  firstName: z.string().min(1, 'ກະລຸນາໃສ່ຊື່'),
  lastName: z.string().min(1, 'ກະລຸນາໃສ່ນາມສະກຸນ'),
  email: z.string().email('ອີເມລບໍ່ຖືກຕ້ອງ').or(z.literal('')),
  address: z.string(),
  photoUrl: z.string(),
})
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0D2B6B] focus:outline-none'

interface Props {
  user: User
}

export function PersonalInfoTab({ user }: Props) {
  const mutation = useUpdateMyProfileMutation()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      address: user.address ?? '',
      photoUrl: user.avatarUrl ?? '',
    },
  })

  const photoUrl = watch('photoUrl')

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        address: data.address || undefined,
        photoUrl: data.photoUrl || undefined,
      },
      {
        onSuccess: () => toast.success('ບັນທຶກສຳເລັດ'),
        onError: () => toast.error('ບັນທຶກລົ້ມເຫລວ'),
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs text-gray-500">ຮູບໂປຣໄຟລ໌</label>
        <FileUpload
          type="profile"
          currentUrl={photoUrl || undefined}
          onUploaded={(url) => setValue('photoUrl', url)}
          onDeleted={() => setValue('photoUrl', '')}
          label="ອັບໂຫລດຮູບ"
          accept="image/*"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">ຊື່</label>
          <input {...register('firstName')} className={inputClass} placeholder="ຊື່" />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500">ນາມສະກຸນ</label>
          <input {...register('lastName')} className={inputClass} placeholder="ນາມສະກຸນ" />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">ອີເມລ</label>
        <input {...register('email')} type="email" className={inputClass} placeholder="email@example.com" />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">ທີ່ຢູ່</label>
        <textarea
          {...register('address')}
          rows={3}
          className={inputClass}
          placeholder="ທີ່ຢູ່..."
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-[#0D2B6B] text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {mutation.isPending && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        ບັນທຶກ
      </button>
    </form>
  )
}
