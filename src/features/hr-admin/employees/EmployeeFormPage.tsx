import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEmployeeQuery } from '../../../hooks/queries/useEmployeeQuery'
import { useEmployeesQuery } from '../../../hooks/queries/useEmployeesQuery'
import { useBranchesQuery } from '../../../hooks/queries/useBranchesQuery'
import { useDepartmentsQuery } from '../../../hooks/queries/useDepartmentsQuery'
import { usePositionsQuery } from '../../../hooks/queries/usePositionsQuery'
import { useShiftsQuery } from '../../../hooks/queries/useShiftsQuery'
import { useCompanyPolicyQuery } from '../../../hooks/queries/useCompanyPolicyQuery'
import { useCreateEmployeeMutation } from '../../../hooks/mutations/useCreateEmployeeMutation'
import { useUpdateEmployeeMutation } from '../../../hooks/mutations/useUpdateEmployeeMutation'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { NumberInput } from '../../../components/ui/NumberInput'
import { Card } from '../../../components/ui/Card'
import { PageLoader } from '../../../components/ui/LoadingSpinner'
import { shiftsApi } from '../../../api/shifts.api'
import type { AllowanceDto, CreateEmployeeDto, EmploymentType } from '../../../types/employee'
import { useAuthStore } from '../../../stores/useAuthStore'
import { toast } from '../../../components/ui/Toast'

// --- error helpers ---

function parseApiError(error: unknown): string {
  if (
    error !== null &&
    typeof error === 'object' &&
    'response' in error
  ) {
    const res = (error as { response?: { data?: { message?: string; statusCode?: number } } }).response
    const message = res?.data?.message ?? ''
    const statusCode = res?.data?.statusCode

    if (statusCode === 409) {
      if (message.toLowerCase().includes('phone')) return 'ເບີໂທນີ້ຖືກລົງທະບຽນແລ້ວໃນບໍລິສັດນີ້'
      if (message.toLowerCase().includes('employee code')) return 'ລະຫັດພະນັກງານນີ້ມີຢູ່ແລ້ວ'
    }
    if (statusCode === 403) return 'ເກີນຈຳນວນພະນັກງານທີ່ອະນຸຍາດ'
    if (message) return message
  }
  if (error instanceof Error && error.message) return error.message
  return 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່'
}

// --- validation helpers ---

const PHONE_RE = /^\+?\d{8,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(form: FormState, isEdit: boolean): Record<string, string> {
  const errs: Record<string, string> = {}

  if (!form.firstName.trim()) errs.firstName = 'ກະລຸນາໃສ່ຊື່'
  if (!form.lastName.trim()) errs.lastName = 'ກະລຸນາໃສ່ນາມສະກຸນ'

  if (!form.phone.trim()) {
    errs.phone = 'ກະລຸນາໃສ່ເບີໂທ'
  } else if (!PHONE_RE.test(form.phone.trim())) {
    errs.phone = 'ເບີໂທຕ້ອງເປັນຕົວເລກ 8-15 ຫຼັກ (ອາດມີ + ນຳໜ້າ)'
  }

  if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
    errs.email = 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ'
  }

  if (!form.branchId) errs.branchId = 'ກະລຸນາເລືອກສາຂາ'

  if (!isEdit && !form.role) errs.role = 'ກະລຸນາເລືອກສິດທິ'

  if (form.probationEndDate && form.startDate && form.probationEndDate < form.startDate) {
    errs.probationEndDate = 'ວັນສຸດທ້າຍທົດລອງຕ້ອງຫຼັງ ຫຼື ເທົ່າກັບວັນທີເລີ່ມງານ'
  }

  if (form.baseSalary && Number(form.baseSalary) <= 0) {
    errs.baseSalary = 'ເງິນເດືອນຕ້ອງຫຼາຍກວ່າ 0'
  }

  if (!isEdit) {
    if (!form.initialPassword.trim()) {
      errs.initialPassword = 'ກະລຸນາໃສ່ລະຫັດຜ່ານເລີ່ມຕົ້ນ'
    } else if (form.initialPassword.trim().length < 6) {
      errs.initialPassword = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 6 ຕົວ'
    }
  }

  if (form.newPassword && form.newPassword.trim().length < 8) {
    errs.newPassword = 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງນ້ອຍ 8 ຕົວ'
  }

  return errs
}

// --- types ---

interface FormState {
  firstName: string
  lastName: string
  firstNameEn: string
  lastNameEn: string
  nickname: string
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
  baseSalary: string    // raw digits, no commas
  allowances: AllowanceDto[]
  workingHoursPerMonth: string
  employeeCode: string
  initialPassword: string
  newPassword: string
  role: string
}

interface ShiftAssignState {
  shiftId: string
  effectiveDate: string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  firstNameEn: '',
  lastNameEn: '',
  nickname: '',
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

// --- sub-components ---

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
  onNameChange: (index: number, value: string) => void
  onAmountChange: (index: number, raw: string) => void
  onRemove: (index: number) => void
}

function AllowanceRow({ item, index, onNameChange, onAmountChange, onRemove }: AllowanceRowProps) {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          label={index === 0 ? 'ຊື່ເງິນໂບນັດ' : ''}
          value={item.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          placeholder="ເຊັ່ນ: ເງິນຄ່າເດີນທາງ"
        />
      </div>
      <div className="w-40">
        <NumberInput
          label={index === 0 ? 'ຈໍານວນ (ກີບ)' : ''}
          value={item.amount === 0 ? '' : item.amount.toString()}
          onChange={(raw) => onAmountChange(index, raw)}
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

// --- main page ---

export default function EmployeeFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const currentUser = useAuthStore((s) => s.user)

  const canEditCredentials =
    isEdit &&
    (currentUser?.role === 'COMPANY_OWNER' || currentUser?.role === 'HR_ADMIN')

  const allowedRoles =
    currentUser?.role === 'COMPANY_OWNER'
      ? ['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF']
      : currentUser?.role === 'HR_ADMIN'
      ? ['BRANCH_MANAGER', 'SUPERVISOR', 'STAFF']
      : ['STAFF']

  const { data: existingEmployee, isLoading: isLoadingEmployee } = useEmployeeQuery(id ?? '')
  const { data: companyPolicy } = useCompanyPolicyQuery()
  const isShiftBased = companyPolicy?.workScheduleMode === 'SHIFT_BASED'

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [shiftAssign, setShiftAssign] = useState<ShiftAssignState>({ shiftId: '', effectiveDate: '' })
  const [shiftError, setShiftError] = useState('')
  const [showInitialPassword, setShowInitialPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  // track original values for change detection
  const [originalRole, setOriginalRole] = useState<string>('')
  const [originalShiftId, setOriginalShiftId] = useState<string>('')
  const [showRoleConfirm, setShowRoleConfirm] = useState(false)

  // load current shift assignment for pre-population in edit mode
  const { data: currentShiftAssignment } = useQuery({
    queryKey: ['employees', id, 'shift'],
    queryFn: () => shiftsApi.getEmployeeShift(id!),
    enabled: isEdit && isShiftBased,
  })

  const { data: branchData } = useBranchesQuery({ limit: 100, isActive: true })
  const { data: deptData } = useDepartmentsQuery({ limit: 100 })
  const { data: posData } = usePositionsQuery({ limit: 100 })
  const { data: shiftsData } = useShiftsQuery()

  const { data: managerData, isLoading: isLoadingManagers } = useEmployeesQuery({
    limit: 100,
    branchId: form.branchId || undefined,
    status: 'ACTIVE',
  })

  const createMutation = useCreateEmployeeMutation()
  const updateMutation = useUpdateEmployeeMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!existingEmployee) return
    const e = existingEmployee
    const role = e.role ?? 'STAFF'
    setForm({
      firstName: e.firstName,
      lastName: e.lastName,
      firstNameEn: e.firstNameEn ?? '',
      lastNameEn: e.lastNameEn ?? '',
      nickname: e.nickname ?? '',
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
      role,
    })
    setOriginalRole(role)
  }, [existingEmployee])

  // pre-populate shift dropdown once current assignment is loaded
  useEffect(() => {
    if (!currentShiftAssignment) return
    const shiftId = currentShiftAssignment.shiftId?.id ?? ''
    setShiftAssign({ shiftId, effectiveDate: new Date().toISOString().slice(0, 10) })
    setOriginalShiftId(shiftId)
  }, [currentShiftAssignment])

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      // clear field error on change
      if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: '' }))
    }

  const addAllowance = () => {
    setForm((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { name: '', amount: 0 }],
    }))
  }

  const updateAllowanceName = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.allowances]
      next[index] = { ...next[index], name: value }
      return { ...prev, allowances: next }
    })
  }

  const updateAllowanceAmount = (index: number, raw: string) => {
    setForm((prev) => {
      const next = [...prev.allowances]
      next[index] = { ...next[index], amount: raw ? Number(raw) : 0 }
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
    firstNameEn: form.firstNameEn.trim() || undefined,
    lastNameEn: form.lastNameEn.trim() || undefined,
    nickname: form.nickname.trim() || undefined,
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
    allowances:
      form.allowances.length > 0
        ? form.allowances.map(({ name, amount }) => ({ name, amount }))
        : undefined,
    workingHoursPerMonth: form.workingHoursPerMonth
      ? Number(form.workingHoursPerMonth)
      : undefined,
    // create mode: auto-gen, edit mode: allow HR override
    employeeCode: isEdit ? form.employeeCode.trim() || undefined : undefined,
    initialPassword: form.initialPassword.trim() || undefined,
    newPassword: form.newPassword.trim() || undefined,
    // edit mode: only send role if changed (and user has permission)
    role: isEdit
      ? canEditCredentials && form.role !== originalRole
        ? (form.role as 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF')
        : undefined
      : (form.role as 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF') || undefined,
  })

  const shiftChanged = isEdit && shiftAssign.shiftId !== originalShiftId && shiftAssign.shiftId !== ''
  const roleChanged = isEdit && canEditCredentials && form.role !== originalRole

  const doSave = async () => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, body: buildDto() })

        // assign new shift only if changed
        if (isShiftBased && shiftChanged) {
          if (!shiftAssign.effectiveDate) {
            setShiftError('ກະລຸນາລະບຸວັນທີມີຜົນ')
            return
          }
          await shiftsApi.assign(shiftAssign.shiftId, {
            employeeId: id,
            effectiveDate: shiftAssign.effectiveDate,
          })
        }
      } else {
        const created = await createMutation.mutateAsync(buildDto())

        // assign shift if selected
        if (isShiftBased && shiftAssign.shiftId && shiftAssign.effectiveDate) {
          await shiftsApi.assign(shiftAssign.shiftId, {
            employeeId: created.id,
            effectiveDate: shiftAssign.effectiveDate,
          })
        }
      }
      toast.success(isEdit ? 'ອັບເດດຂໍ້ມູນສຳເລັດ' : 'ສ້າງພະນັກງານສຳເລັດ')
      navigate('/hr/employees')
    } catch (error) {
      const message = parseApiError(error)
      setGlobalError(message)
      toast.error(message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')

    const errs = validateForm(form, isEdit)
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setGlobalError('ກະລຸນາກວດສອບຂໍ້ມູນທີ່ຜິດພາດ')
      return
    }

    // shift assign validation (create only, SHIFT_BASED only)
    if (!isEdit && isShiftBased && shiftAssign.shiftId && !shiftAssign.effectiveDate) {
      setShiftError('ກະລຸນາລະບຸວັນທີມີຜົນ')
      return
    }

    // show role confirm dialog if role changed in edit mode
    if (roleChanged) {
      setShowRoleConfirm(true)
      return
    }

    await doSave()
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
            <Input
              label="ຊື່ *"
              value={form.firstName}
              onChange={setField('firstName')}
              placeholder="ຊື່"
              error={fieldErrors.firstName}
            />
            <Input
              label="ນາມສະກຸນ *"
              value={form.lastName}
              onChange={setField('lastName')}
              placeholder="ນາມສະກຸນ"
              error={fieldErrors.lastName}
            />
            <Input
              label="First name (English)"
              value={form.firstNameEn}
              onChange={setField('firstNameEn')}
              placeholder="First name"
            />
            <Input
              label="Last name (English)"
              value={form.lastNameEn}
              onChange={setField('lastNameEn')}
              placeholder="Last name"
            />
            <Input
              label="ຊື່ຫຼິ້ນ"
              value={form.nickname}
              onChange={setField('nickname')}
              placeholder="ຊື່ຫຼິ້ນ"
            />
            <Input
              label="ເບີໂທ *"
              value={form.phone}
              onChange={setField('phone')}
              placeholder="020xxxxxxxx"
              error={fieldErrors.phone}
            />
            <Input
              label="ອີເມວ"
              value={form.email}
              onChange={setField('email')}
              placeholder="email@example.com"
              type="email"
              error={fieldErrors.email}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ເພດ</label>
              <select
                value={form.gender}
                onChange={setField('gender')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ເລືອກເພດ</option>
                <option value="MALE">ຊາຍ</option>
                <option value="FEMALE">ຍິງ</option>
                <option value="OTHER">ອື່ນໆ</option>
              </select>
            </div>
            <Input
              label="ວັນເດືອນປີເກີດ"
              type="date"
              value={form.dateOfBirth}
              onChange={setField('dateOfBirth')}
            />
            <Input
              label="ສັນຊາດ"
              value={form.nationality}
              onChange={setField('nationality')}
              placeholder="ລາວ"
            />
            {/* employeeCode: disabled in create (auto-gen), editable in edit */}
            <Input
              label="ລະຫັດພະນັກງານ"
              value={isEdit ? form.employeeCode : ''}
              onChange={isEdit ? setField('employeeCode') : undefined}
              placeholder={isEdit ? 'EMP001' : 'ສ້າງອັດຕະໂນມັດ'}
              disabled={!isEdit}
            />
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
              <select
                value={form.employmentType}
                onChange={setField('employmentType')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ເລືອກປະເພດ</option>
                <option value="FULL_TIME">ເຕັມເວລາ</option>
                <option value="PART_TIME">ບາງເວລາ</option>
                <option value="CONTRACT">ສັນຍາ</option>
                <option value="INTERN">ຝຶກງານ</option>
              </select>
            </div>

            {/* role: required in create mode; editable in edit mode for COMPANY_OWNER / HR_ADMIN */}
            {(!isEdit || canEditCredentials) && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  ສິດທິ (Role){!isEdit && ' *'}
                </label>
                <select
                  value={form.role}
                  onChange={setField('role')}
                  className={`rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary ${
                    fieldErrors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {!isEdit && <option value="">ເລືອກສິດທິ</option>}
                  {allowedRoles.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r] ?? r}
                    </option>
                  ))}
                </select>
                {fieldErrors.role && (
                  <p className="text-xs text-red-600">{fieldErrors.role}</p>
                )}
                {isEdit && roleChanged && (
                  <p className="text-xs text-amber-600">Role ຈະຖືກປ່ຽນຈາກ {ROLE_LABELS[originalRole] ?? originalRole} → {ROLE_LABELS[form.role] ?? form.role}</p>
                )}
              </div>
            )}

            {/* branchId: required */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ສາຂາ *</label>
              <select
                value={form.branchId}
                onChange={setField('branchId')}
                className={`rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.branchId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">ເລືອກສາຂາ</option>
                {branchData?.data.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {fieldErrors.branchId && (
                <p className="text-xs text-red-600">{fieldErrors.branchId}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ພະແນກ</label>
              <select
                value={form.departmentId}
                onChange={setField('departmentId')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ເລືອກພະແນກ</option>
                {deptData?.data.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ຕໍາແໜ່ງ</label>
              <select
                value={form.positionId}
                onChange={setField('positionId')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ເລືອກຕໍາແໜ່ງ</option>
                {posData?.data.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
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
                {!isLoadingManagers &&
                  managerData?.data
                    .filter((emp) => emp.id !== id)
                    .map((emp) => {
                      const positionName = posData?.data.find(
                        (p) => p.id === emp.positionId,
                      )?.name
                      const codePrefix = emp.employeeCode ? `${emp.employeeCode} - ` : ''
                      const positionSuffix = positionName ? ` (${positionName})` : ''
                      return (
                        <option key={emp.id} value={emp.id}>
                          {codePrefix}
                          {emp.firstName} {emp.lastName}
                          {positionSuffix}
                        </option>
                      )
                    })}
              </select>
            </div>

            <Input
              label="ວັນທີເລີ່ມງານ"
              type="date"
              value={form.startDate}
              onChange={setField('startDate')}
            />
            <Input
              label="ວັນສຸດທ້າຍທົດລອງ"
              type="date"
              value={form.probationEndDate}
              onChange={setField('probationEndDate')}
              error={fieldErrors.probationEndDate}
            />
          </div>
        </Card>

        {/* Salary */}
        <Card>
          <SectionTitle title="ເງິນເດືອນ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <NumberInput
              label="ເງິນເດືອນພື້ນຖານ (ກີບ)"
              value={form.baseSalary}
              onChange={(raw) => {
                setForm((prev) => ({ ...prev, baseSalary: raw }))
                if (fieldErrors.baseSalary) setFieldErrors((prev) => ({ ...prev, baseSalary: '' }))
              }}
              placeholder="0"
              error={fieldErrors.baseSalary}
            />
            <Input
              label="ຊົ່ວໂມງ/ເດືອນ"
              type="number"
              value={form.workingHoursPerMonth}
              onChange={setField('workingHoursPerMonth')}
              placeholder="160"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">ເງິນໂບນັດ / ເງິນເພີ່ມ</span>
              <button
                type="button"
                onClick={addAllowance}
                className="text-sm text-primary hover:underline font-medium"
              >
                + ເພີ່ມລາຍການ
              </button>
            </div>
            {form.allowances.length === 0 && (
              <p className="text-sm text-gray-400 py-2">
                ຍັງບໍ່ມີລາຍການ — ກົດ "ເພີ່ມລາຍການ" ເພື່ອເພີ່ມ
              </p>
            )}
            {form.allowances.map((item, index) => (
              <AllowanceRow
                key={index}
                item={item}
                index={index}
                onNameChange={updateAllowanceName}
                onAmountChange={updateAllowanceAmount}
                onRemove={removeAllowance}
              />
            ))}
          </div>
        </Card>

        {/* Shift assignment — SHIFT_BASED companies, both create and edit */}
        {isShiftBased && (
          <Card>
            <SectionTitle title={isEdit ? 'ກຳນົດກະ (ເປີ່ຽນກະໃໝ່)' : 'ກຳນົດກະ (ຖ້າຕ້ອງການ)'} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">ກະ</label>
                <select
                  value={shiftAssign.shiftId}
                  onChange={(e) => {
                    setShiftAssign((prev) => ({ ...prev, shiftId: e.target.value }))
                    setShiftError('')
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{isEdit ? 'ບໍ່ປ່ຽນກະ' : 'ບໍ່ລະບຸ (ຂ້າມໄດ້)'}</option>
                  {shiftsData
                    ?.filter((s) => s.isActive)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.startTime && s.endTime ? ` (${s.startTime}–${s.endTime})` : ''}
                      </option>
                    ))}
                </select>
              </div>

              {/* effectiveDate: always show in create; show in edit only when shift changed */}
              {(!isEdit || shiftChanged) && (
                <Input
                  label="ວັນທີມີຜົນ"
                  type="date"
                  value={shiftAssign.effectiveDate}
                  onChange={(e) => {
                    setShiftAssign((prev) => ({ ...prev, effectiveDate: e.target.value }))
                    setShiftError('')
                  }}
                  error={shiftError}
                />
              )}
            </div>

            {isEdit && shiftChanged && (
              <p className="mt-2 text-xs text-amber-600">
                ກະຈະຖືກປ່ຽນແປງຫຼັງຈາກບັນທຶກສຳເລັດ
              </p>
            )}
            {!isEdit && shiftAssign.shiftId && (
              <p className="mt-2 text-xs text-gray-500">
                ກຳນົດກະຈະຖືກບັນທຶກຫຼັງຈາກສ້າງພະນັກງານສຳເລັດ
              </p>
            )}
          </Card>
        )}

        {/* Account — create: initial password required; edit (COMPANY_OWNER/HR_ADMIN): new password */}
        {!isEdit && (
          <Card>
            <SectionTitle title="ບັນຊີເຂົ້າລະບົບ" />
            <div className="max-w-xs">
              <div className="relative">
                <Input
                  label="ລະຫັດຜ່ານເລີ່ມຕົ້ນ *"
                  type={showInitialPassword ? 'text' : 'password'}
                  value={form.initialPassword}
                  onChange={setField('initialPassword')}
                  placeholder="ຢ່າງນ້ອຍ 6 ຕົວ"
                  error={fieldErrors.initialPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowInitialPassword((v) => !v)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showInitialPassword ? 'ເຊື່ອງລະຫັດຜ່ານ' : 'ສະແດງລະຫັດຜ່ານ'}
                >
                  {showInitialPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
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
              <div className="relative">
                <Input
                  label="ລະຫັດຜ່ານໃໝ່ (ຖ້າຕ້ອງການປ່ຽນ)"
                  type={showNewPassword ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={setField('newPassword')}
                  placeholder="ຫວ່າງ = ບໍ່ປ່ຽນ"
                  error={fieldErrors.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showNewPassword ? 'ເຊື່ອງລະຫັດຜ່ານ' : 'ສະແດງລະຫັດຜ່ານ'}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງນ້ອຍ 8 ຕົວ</p>
          </Card>
        )}

        {globalError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{globalError}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/hr/employees')}>
            ຍົກເລີກ
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'ບັນທຶກການແກ້ໄຂ' : 'ສ້າງພະນັກງານ'}
          </Button>
        </div>
      </form>

      {/* Role change confirm dialog */}
      {showRoleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">ຢືນຢັນການປ່ຽນ Role</h3>
            <p className="mt-2 text-sm text-gray-600">
              ການປ່ຽນ Role ຈາກ <span className="font-medium">{ROLE_LABELS[originalRole] ?? originalRole}</span> ເປັນ{' '}
              <span className="font-medium">{ROLE_LABELS[form.role] ?? form.role}</span> ຈະມີຜົນທັນທີ. ທ່ານແນ່ໃຈບໍ?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRoleConfirm(false)}
              >
                ຍົກເລີກ
              </Button>
              <Button
                loading={isSubmitting}
                onClick={() => {
                  setShowRoleConfirm(false)
                  void doSave()
                }}
              >
                ຢືນຢັນ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
