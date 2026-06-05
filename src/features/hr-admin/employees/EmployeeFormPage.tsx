import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEmployeeQuery } from '../../../hooks/queries/useEmployeeQuery'
import { useEmployeesQuery } from '../../../hooks/queries/useEmployeesQuery'
import { useBranchesQuery } from '../../../hooks/queries/useBranchesQuery'
import { useDepartmentsQuery } from '../../../hooks/queries/useDepartmentsQuery'
import { usePositionsQuery } from '../../../hooks/queries/usePositionsQuery'
import { useCreateEmployeeMutation } from '../../../hooks/mutations/useCreateEmployeeMutation'
import { useUpdateEmployeeMutation } from '../../../hooks/mutations/useUpdateEmployeeMutation'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Card } from '../../../components/ui/Card'
import { PageLoader } from '../../../components/ui/LoadingSpinner'
import type { AllowanceDto, CreateEmployeeDto, EmploymentType } from '../../../types/employee'
import { useAuthStore } from '../../../stores/useAuthStore'

interface FormState {
  firstName: string
  lastName: string
  phone: string
  gender: string
  dateOfBirth: string
  email: string
  address: string
  nationality: string
  employmentType: EmploymentType | ''
  startDate: string
  probationEndDate: string
  branchId: string
  departmentId: string
  positionId: string
  managerId: string
  supervisorId: string
  baseSalary: string
  allowances: AllowanceDto[]
  workingHoursPerMonth: string
  employeeCode: string
  initialPassword: string
  newPassword: string
  role: string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  address: '',
  nationality: '',
  employmentType: '',
  startDate: '',
  probationEndDate: '',
  branchId: '',
  departmentId: '',
  positionId: '',
  managerId: '',
  supervisorId: '',
  baseSalary: '',
  allowances: [],
  workingHoursPerMonth: '',
  employeeCode: '',
  initialPassword: '',
  newPassword: '',
  role: 'STAFF',
}

const ROLE_LABELS: Record<string, string> = {
  HR_ADMIN: 'ຜູ້ຈັດການ HR',
  BRANCH_MANAGER: 'ຜູ້ຈັດການສາຂາ',
  SUPERVISOR: 'ຫົວໜ້າທີມ',
  STAFF: 'ພະນັກງານ',
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
      {title}
    </h2>
  )
}

interface AllowanceRowProps {
  item: AllowanceDto
  index: number
  onChange: (index: number, field: keyof AllowanceDto, value: string) => void
  onRemove: (index: number) => void
}

function AllowanceRow({ item, index, onChange, onRemove }: AllowanceRowProps) {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          label={index === 0 ? 'ຊື່ເງິນໂບນັດ' : ''}
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          placeholder="ເຊັ່ນ: ເງິນຄ່າເດີນທາງ"
        />
      </div>
      <div className="w-36">
        <Input
          label={index === 0 ? 'ຈໍານວນ (ກີບ)' : ''}
          type="number"
          value={item.amount === 0 ? '' : item.amount.toString()}
          onChange={(e) => onChange(index, 'amount', e.target.value)}
          placeholder="0"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mb-0.5 px-2 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="ລຶບ"
      >
        ✕
      </button>
    </div>
  )
}

export default function EmployeeFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const currentUser = useAuthStore((s) => s.user)
  const canEditCredentials = isEdit && (currentUser?.role === 'COMPANY_OWNER' || currentUser?.role === 'HR_ADMIN')
  const allowedRoles = currentUser?.role === 'COMPANY_OWNER'
    ? ['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF']
    : currentUser?.role === 'HR_ADMIN'
    ? ['BRANCH_MANAGER', 'SUPERVISOR', 'STAFF']
    : ['STAFF']

  const { data: existingEmployee, isLoading: isLoadingEmployee } = useEmployeeQuery(id ?? '')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState('')

  const { data: branchData } = useBranchesQuery({ limit: 100, isActive: true })
  const { data: deptData } = useDepartmentsQuery({ limit: 100 })
  const { data: posData } = usePositionsQuery({ limit: 100 })
  // Load potential managers filtered by selected branch
  const { data: managerData, isLoading: isLoadingManagers } = useEmployeesQuery({
    limit: 100,
    branchId: form.branchId || undefined,
    status: 'ACTIVE',
  })

  const createMutation = useCreateEmployeeMutation()
  const updateMutation = useUpdateEmployeeMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!existingEmployee) return
    const e = existingEmployee
    setForm({
      firstName: e.firstName,
      lastName: e.lastName,
      phone: e.phone,
      gender: e.gender ?? '',
      dateOfBirth: e.dateOfBirth?.slice(0, 10) ?? '',
      email: e.email ?? '',
      address: e.address ?? '',
      nationality: e.nationality ?? '',
      employmentType: e.employmentType ?? '',
      startDate: e.startDate?.slice(0, 10) ?? '',
      probationEndDate: e.probationEndDate?.slice(0, 10) ?? '',
      branchId: e.branchId ?? '',
      departmentId: e.departmentId ?? '',
      positionId: e.positionId ?? '',
      managerId: e.managerId ?? '',
      supervisorId: e.supervisorId ?? '',
      baseSalary: e.baseSalary?.toString() ?? '',
      allowances: e.allowances ?? [],
      workingHoursPerMonth: e.workingHoursPerMonth?.toString() ?? '',
      employeeCode: e.employeeCode ?? '',
      initialPassword: '',
      newPassword: '',
      role: e.role ?? 'STAFF',
    })
  }, [existingEmployee])

  const setField = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const addAllowance = () => {
    setForm((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { name: '', amount: 0 }],
    }))
  }

  const updateAllowance = (index: number, field: keyof AllowanceDto, value: string) => {
    setForm((prev) => {
      const next = [...prev.allowances]
      next[index] = {
        ...next[index],
        [field]: field === 'amount' ? Number(value) : value,
      }
      return { ...prev, allowances: next }
    })
  }

  const removeAllowance = (index: number) => {
    setForm((prev) => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index),
    }))
  }

  const buildDto = (): CreateEmployeeDto & { newPassword?: string } => ({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phone: form.phone.trim(),
    gender: form.gender || undefined,
    dateOfBirth: form.dateOfBirth || undefined,
    email: form.email.trim() || undefined,
    address: form.address.trim() || undefined,
    nationality: form.nationality.trim() || undefined,
    employmentType: (form.employmentType as EmploymentType) || undefined,
    startDate: form.startDate || undefined,
    probationEndDate: form.probationEndDate || undefined,
    branchId: form.branchId || undefined,
    departmentId: form.departmentId || undefined,
    positionId: form.positionId || undefined,
    managerId: form.managerId || undefined,
    supervisorId: form.supervisorId || undefined,
    baseSalary: form.baseSalary ? Number(form.baseSalary) : undefined,
    allowances: form.allowances.length > 0
      ? form.allowances.map(({ name, amount }) => ({ name, amount }))
      : undefined,
    workingHoursPerMonth: form.workingHoursPerMonth ? Number(form.workingHoursPerMonth) : undefined,
    employeeCode: form.employeeCode.trim() || undefined,
    initialPassword: form.initialPassword.trim() || undefined,
    newPassword: form.newPassword.trim() || undefined,
    role: (form.role as 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF') || undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      setError('ກະລຸນາໃສ່ຊື່, ນາມສະກຸນ, ແລະ ເບີໂທ')
      return
    }
    if (form.newPassword && form.newPassword.trim().length < 8) {
      setError('ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງນ້ອຍ 8 ຕົວ')
      return
    }

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, body: buildDto() })
      } else {
        await createMutation.mutateAsync(buildDto())
      }
      navigate('/hr/employees')
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  if (isEdit && isLoadingEmployee) return <PageLoader />

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {isEdit ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານໃໝ່'}
        </h1>
        <Button variant="ghost" onClick={() => navigate('/hr/employees')}>
          ກັບຄືນ
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <Card>
          <SectionTitle title="ຂໍ້ມູນສ່ວນຕົວ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="ຊື່ *" value={form.firstName} onChange={setField('firstName')} placeholder="ຊື່" />
            <Input label="ນາມສະກຸນ *" value={form.lastName} onChange={setField('lastName')} placeholder="ນາມສະກຸນ" />
            <Input label="ເບີໂທ *" value={form.phone} onChange={setField('phone')} placeholder="020xxxxxxxx" />
            <Input label="ອີເມວ" value={form.email} onChange={setField('email')} placeholder="email@example.com" type="email" />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ເພດ</label>
              <select value={form.gender} onChange={setField('gender')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">ເລືອກເພດ</option>
                <option value="MALE">ຊາຍ</option>
                <option value="FEMALE">ຍິງ</option>
                <option value="OTHER">ອື່ນໆ</option>
              </select>
            </div>
            <Input label="ວັນເດືອນປີເກີດ" type="date" value={form.dateOfBirth} onChange={setField('dateOfBirth')} />
            <Input label="ສັນຊາດ" value={form.nationality} onChange={setField('nationality')} placeholder="ລາພັກວ" />
            <Input label="ລະຫັດພະນັກງານ" value={form.employeeCode} onChange={setField('employeeCode')} placeholder="EMP001" />
          </div>
          <div className="mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ທີ່ຢູ່</label>
              <textarea
                value={form.address}
                onChange={setField('address')}
                placeholder="ທີ່ຢູ່ປັດຈຸບັນ"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </Card>

        {/* Job Assignment */}
        <Card>
          <SectionTitle title="ການມອບໝາຍງານ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ປະເພດການຈ້າງ</label>
              <select value={form.employmentType} onChange={setField('employmentType')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">ເລືອກປະເພດ</option>
                <option value="FULL_TIME">ເຕັມເວລາພັກ</option>
                <option value="PART_TIME">ບາງເວລາພັກ</option>
                <option value="CONTRACT">ສັນຍາ</option>
                <option value="INTERN">ຝຶກງານ</option>
              </select>
            </div>
            {!isEdit && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">ສິດທິ (Role)</label>
                <select
                  value={form.role}
                  onChange={setField('role')}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {allowedRoles.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ສາຂາ</label>
              <select value={form.branchId} onChange={setField('branchId')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">ເລືອກສາຂາ</option>
                {branchData?.data.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ພະແນກ</label>
              <select value={form.departmentId} onChange={setField('departmentId')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">ເລືອກພະແນກ</option>
                {deptData?.data.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ຕໍາແໜ່ງ</label>
              <select value={form.positionId} onChange={setField('positionId')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">ເລືອກຕໍາແໜ່ງ</option>
                {posData?.data.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ຜູ້ຈັດການ</label>
              <select
                value={form.managerId}
                onChange={setField('managerId')}
                disabled={isLoadingManagers}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">
                  {isLoadingManagers ? 'ກຳລັງໂຫຼດ...' : 'ຄົ້ນຫາ ຫຼື ເລືອກຜູ້ຈັດການ'}
                </option>
                {!isLoadingManagers && managerData?.data
                  .filter((emp) => emp.id !== id)
                  .map((emp) => {
                    const positionName = posData?.data.find((p) => p.id === emp.positionId)?.name
                    const codePrefix = emp.employeeCode ? `${emp.employeeCode} - ` : ''
                    const positionSuffix = positionName ? ` (${positionName})` : ''
                    return (
                      <option key={emp.id} value={emp.id}>
                        {codePrefix}{emp.firstName} {emp.lastName}{positionSuffix}
                      </option>
                    )
                  })}
              </select>
            </div>
            <Input label="ວັນທີເລີ່ມງານ" type="date" value={form.startDate} onChange={setField('startDate')} />
            <Input label="ວັນສຸດທ້າຍທົດລອງ" type="date" value={form.probationEndDate} onChange={setField('probationEndDate')} />
          </div>
        </Card>

        {/* Salary */}
        <Card>
          <SectionTitle title="ເງິນເດືອນ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input label="ເງິນເດືອນພື້ນຖານ (ກີບ)" type="number" value={form.baseSalary} onChange={setField('baseSalary')} placeholder="0" />
            <Input label="ຊົ່ວໂມງ/ເດືອນ" type="number" value={form.workingHoursPerMonth} onChange={setField('workingHoursPerMonth')} placeholder="160" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">ເງິນໂບນັດ / ເງິນເພີ່ມ</span>
              <button
                type="button"
                onClick={addAllowance}
                className="text-sm text-primary hover:underline font-medium"
              >
                + ເພີ່ມລາພັກຍການ
              </button>
            </div>
            {form.allowances.length === 0 && (
              <p className="text-sm text-gray-400 py-2">ຍັງບໍ່ມີລາພັກຍການ — ກົດ "ເພີ່ມລາພັກຍການ" ເພື່ອເພີ່ມ</p>
            )}
            {form.allowances.map((item, index) => (
              <AllowanceRow
                key={index}
                item={item}
                index={index}
                onChange={updateAllowance}
                onRemove={removeAllowance}
              />
            ))}
          </div>
        </Card>

        {/* Account — create: show initialPassword; edit (COMPANY_OWNER/HR_ADMIN): show newPassword */}
        {!isEdit && (
          <Card>
            <SectionTitle title="ບັນຊີເຂົ້າລະບົບ" />
            <div className="max-w-xs">
              <Input
                label="ລະຫັດຜ່ານເລີ່ມຕົ້ນ"
                type="password"
                value={form.initialPassword}
                onChange={setField('initialPassword')}
                placeholder="ຖ້າວ່າງ ລະບົບຈະສ້າງໃຫ້"
              />
            </div>
          </Card>
        )}
        {canEditCredentials && (
          <Card>
            <SectionTitle title="ຂໍ້ມູນການເຂົ້າລະບົບ" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="ເບີໂທ (ສໍາລັບ login)"
                value={form.phone}
                onChange={setField('phone')}
                placeholder="020xxxxxxxx"
              />
              <Input
                label="ລະຫັດຜ່ານໃໝ່ (ຖ້າຕ້ອງການປ່ຽນ)"
                type="password"
                value={form.newPassword}
                onChange={setField('newPassword')}
                placeholder="ຫວ່າງ = ບໍ່ປ່ຽນ"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງນ້ອຍ 8 ຕົວ</p>
          </Card>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/hr/employees')}>
            ຍົກເລີກ
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEdit ? 'ບັນທຶກການແກ້ໄຂ' : 'ສ້າງພະນັກງານ'}
          </Button>
        </div>
      </form>
    </div>
  )
}
