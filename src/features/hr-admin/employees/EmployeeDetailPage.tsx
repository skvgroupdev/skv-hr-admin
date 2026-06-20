import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, Upload } from 'lucide-react'
import { useEmployeeQuery } from '../../../hooks/queries/useEmployeeQuery'
import { useEmployeeDocumentsQuery } from '../../../hooks/queries/useEmployeeDocumentsQuery'
import { useUploadDocumentMutation } from '../../../hooks/mutations/useUploadDocumentMutation'
import { useEmployeePayslipsQuery } from '../../../hooks/queries/usePayrollQuery'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { PageLoader } from '../../../components/ui/LoadingSpinner'
import type { DocumentType, UploadDocumentDto } from '../../../types/employee'
import { formatDateOnly } from '../../../utils/date'
import { useAuthStore } from '../../../stores/useAuthStore'
import { EmployeeFinanceDashboard } from '../payroll/EmployeeFinanceDashboard'
import { EmployeeShiftCard } from './EmployeeShiftCard'
import { EmployeeAttendanceReport } from './EmployeeAttendanceReport'

// ---- Labels ----------------------------------------------------------------

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'ເຄື່ອນໄຫວ',
  INACTIVE: 'ບໍ່ເຄື່ອນໄຫວ',
  PROBATION: 'ທົດລອງງານ',
  RESIGNED: 'ລາພັກ',
  SUSPENDED: 'ໂຈະ',
  TERMINATED: 'ໄລ່ອອກ',
}

const ROLE_LABELS: Record<string, string> = {
  HR_ADMIN: 'ຜູ້ຈັດການ HR',
  BRANCH_MANAGER: 'ຜູ້ຈັດການສາຂາ',
  SUPERVISOR: 'ຫົວໜ້າທີມ',
  STAFF: 'ພະນັກງານ',
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'ເຕັມເວລາພັກ',
  PART_TIME: 'ເຄິ່ງເວລາພັກ',
  CONTRACT: 'ສັນຍາຈ້າງ',
  INTERN: 'ຝຶກງານ',
}

const GENDER_LABELS: Record<string, string> = {
  MALE: 'ເພດຊາຍ',
  FEMALE: 'ເພດຍິງ',
}

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  ID_CARD: 'ບັດປະຈຳຕົວ',
  PASSPORT: 'ໜັງສືເດີນທາງ',
  CONTRACT: 'ສັນຍາ',
  CV: 'ຊີວີ',
  CERTIFICATE: 'ໃບຢັ້ງຢືນ',
  MEDICAL: 'ການແພດ',
  OTHER: 'ອື່ນໆ',
}

// ---- Shared small components ------------------------------------------------

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value ?? '-'}</p>
    </div>
  )
}

// ---- Tab config -------------------------------------------------------------

const TABS = [
  { key: 'overview', label: 'ພາບລວມ' },
  { key: 'info', label: 'ຂໍ້ມູນສ່ວນຕົວ' },
  { key: 'salary', label: 'ເງິນເດືອນ' },
  { key: 'attendance', label: 'ການເຂົ້າ-ອອກວຽກ' },
  { key: 'permissions', label: 'ສິດທິ' },
] as const

type TabKey = typeof TABS[number]['key']

// ---- Tab components ---------------------------------------------------------

type Employee = NonNullable<ReturnType<typeof useEmployeeQuery>['data']>

function OverviewTab({ employee }: { employee: Employee }) {
  const totalAllowances = (employee.allowances ?? []).reduce(
    (sum, a) => sum + (a.amount ?? 0),
    0,
  )

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {employee.firstName?.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </p>
            {(employee.nickname || employee.firstNameEn || employee.lastNameEn) && (
              <p className="text-sm text-gray-500">
                {employee.nickname ? `(${employee.nickname}) ` : ''}
                {[employee.firstNameEn, employee.lastNameEn].filter(Boolean).join(' ')}
              </p>
            )}
            <p className="text-sm text-gray-500">{employee.position?.name ?? '-'}</p>
            <p className="text-sm text-gray-500">{employee.department?.name ?? '-'}</p>
          </div>
          <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {STATUS_LABELS[employee.status] ?? employee.status}
          </span>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="ວັນທີເລີ່ມ" value={formatDateOnly(employee.startDate)} />
        <StatCard
          label="ປະເພດການຈ້າງ"
          value={EMPLOYMENT_TYPE_LABELS[employee.employmentType ?? ''] ?? employee.employmentType ?? '-'}
        />
        <StatCard
          label="ເງິນເດືອນພື້ນຖານ"
          value={employee.baseSalary?.toLocaleString() ?? '-'}
        />
        <StatCard label="ເງິນໂບນັດລວມ" value={totalAllowances.toLocaleString()} />
      </div>

      <EmployeeFinanceDashboard employeeId={employee.id} />
      <EmployeeShiftCard employeeId={employee.id} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function PersonalInfoTab({ employee }: { employee: Employee }) {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-base font-semibold text-gray-800 mb-4">ຂໍ້ມູນສ່ວນຕົວ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InfoRow label="ຊື່ພາສາອັງກິດ" value={[employee.firstNameEn, employee.lastNameEn].filter(Boolean).join(' ') || undefined} />
          <InfoRow label="ຊື່ຫຼິ້ນ" value={employee.nickname} />
          <InfoRow label="ວັນເກີດ" value={formatDateOnly(employee.dateOfBirth)} />
          <InfoRow label="ເພດ" value={GENDER_LABELS[employee.gender ?? ''] ?? employee.gender} />
          <InfoRow label="ສັນຊາດ" value={employee.nationality} />
          <InfoRow label="ເບີໂທ" value={employee.phone} />
          <InfoRow label="ອີເມວ" value={employee.email} />
          <InfoRow label="ທີ່ຢູ່" value={employee.address} />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-800 mb-4">ຂໍ້ມູນການຈ້າງງານ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InfoRow label="ລະຫັດພະນັກງານ" value={employee.employeeCode} />
          <InfoRow label="ວັນທີເລີ່ມ" value={formatDateOnly(employee.startDate)} />
          <InfoRow label="ສິ້ນສຸດທົດລອງ" value={formatDateOnly(employee.probationEndDate)} />
          <InfoRow label="ພະແນກ" value={employee.department?.name} />
          <InfoRow label="ຕໍາແໜ່ງ" value={employee.position?.name} />
          <InfoRow
            label="ປະເພດການຈ້າງ"
            value={EMPLOYMENT_TYPE_LABELS[employee.employmentType ?? ''] ?? employee.employmentType}
          />
        </div>
      </Card>
    </div>
  )
}

function SalaryTab({ employee }: { employee: Employee }) {
  const { data: payslipsData } = useEmployeePayslipsQuery(employee.id, { page: 1, limit: 10 })

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-base font-semibold text-gray-800 mb-4">ເງິນເດືອນປັດຈຸບັນ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InfoRow label="ເງິນເດືອນພື້ນຖານ" value={employee.baseSalary?.toLocaleString()} />
          <InfoRow label="ຊົ່ວໂມງ/ເດືອນ" value={employee.workingHoursPerMonth} />
        </div>
      </Card>

      {(employee.allowances ?? []).length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4">ເງິນໂບນັດ</h2>
          <ul className="divide-y divide-gray-100">
            {(employee.allowances ?? []).map((allowance, idx) => (
              <li key={idx} className="flex items-center justify-between py-2.5">
                <p className="text-sm text-gray-700">{allowance.name ?? '-'}</p>
                <p className="text-sm font-medium text-gray-900">
                  {(allowance.amount ?? 0).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
            <p className="text-sm font-semibold text-gray-700">ລວມ</p>
            <p className="text-sm font-semibold text-primary">
              {(employee.allowances ?? [])
                .reduce((sum, a) => sum + (a.amount ?? 0), 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
      )}

      {payslipsData && (
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4">ປະຫວັດ Payslip</h2>
          {payslipsData.data.length === 0 ? (
            <p className="text-sm text-gray-400">ຍັງບໍ່ມີ payslip</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {payslipsData.data.map((slip) => (
                <li key={slip.id} className="flex items-center justify-between py-2.5">
                  <p className="text-sm text-gray-700">
                    {slip.period?.name ?? slip.id.slice(-6)}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {slip.netSalary?.toLocaleString() ?? '-'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}

function PermissionsTab({ employee }: { employee: Employee }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-800 mb-4">ສິດທິການໃຊ້ງານ</h2>
      <InfoRow
        label="ສິດທິການໃຊ້ງານ"
        value={ROLE_LABELS[employee.role ?? ''] ?? employee.role ?? '-'}
      />
    </Card>
  )
}

// ---- Upload modal -----------------------------------------------------------

interface UploadFormState {
  fileUrl: string
  fileName: string
  documentType: DocumentType
  description: string
}

const EMPTY_UPLOAD: UploadFormState = {
  fileUrl: '',
  fileName: '',
  documentType: 'OTHER',
  description: '',
}

function UploadDocumentModal({
  employeeId,
  open,
  onClose,
}: {
  employeeId: string
  open: boolean
  onClose: () => void
}) {
  const [form, setForm] = useState<UploadFormState>(EMPTY_UPLOAD)
  const [error, setError] = useState('')
  const uploadMutation = useUploadDocumentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fileUrl.trim()) {
      setError('ກະລຸນາໃສ່ URL ໄຟລ໌')
      return
    }

    const body: UploadDocumentDto = {
      fileUrl: form.fileUrl.trim(),
      fileName: form.fileName.trim() || undefined,
      documentType: form.documentType,
      description: form.description.trim() || undefined,
    }

    try {
      await uploadMutation.mutateAsync({ employeeId, body })
      setForm(EMPTY_UPLOAD)
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title="ອັບໂຫລດເອກະສານ" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="URL ໄຟລ໌ *"
          value={form.fileUrl}
          onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))}
          placeholder="https://..."
        />
        <Input
          label="ຊື່ໄຟລ໌"
          value={form.fileName}
          onChange={(e) => setForm((p) => ({ ...p, fileName: e.target.value }))}
          placeholder="ຊື່ໄຟລ໌"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ປະເພດເອກະສານ</label>
          <select
            value={form.documentType}
            onChange={(e) =>
              setForm((p) => ({ ...p, documentType: e.target.value as DocumentType }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {(Object.keys(DOC_TYPE_LABELS) as DocumentType[]).map((t) => (
              <option key={t} value={t}>
                {DOC_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="ຄຳອະທິບາຍ"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="ຄຳອະທິບາຍເພີ່ມຕື່ມ"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            ຍົກເລີກ
          </Button>
          <Button type="submit" loading={uploadMutation.isPending}>
            ອັບໂຫລດ
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ---- Documents section (shown outside tabs) ---------------------------------

function DocumentsSection({
  employeeId,
  documents,
}: {
  employeeId: string
  documents: { id: string; fileName?: string | null; fileUrl: string; documentType: DocumentType; description?: string | null }[] | undefined
}) {
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">ເອກະສານ</h2>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          ອັບໂຫລດ
        </Button>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <FileText className="h-8 w-8 mb-2" />
          <p className="text-sm">ຍັງບໍ່ມີເອກະສານ</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {doc.fileName ?? DOC_TYPE_LABELS[doc.documentType]}
                </p>
                <p className="text-xs text-gray-500">
                  {DOC_TYPE_LABELS[doc.documentType]}
                  {doc.description ? ` • ${doc.description}` : ''}
                </p>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                ເປີດ
              </a>
            </li>
          ))}
        </ul>
      )}

      <UploadDocumentModal
        employeeId={employeeId}
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </Card>
  )
}

// ---- Page -------------------------------------------------------------------

export default function EmployeeDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const currentUser = useAuthStore((s) => s.user)
  const canManageRoles = currentUser?.role === 'COMPANY_OWNER' || currentUser?.role === 'HR_ADMIN'

  const { data: employee, isLoading } = useEmployeeQuery(id ?? '')
  const { data: documents } = useEmployeeDocumentsQuery(id ?? '')

  if (isLoading) return <PageLoader />
  if (!employee) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">ບໍ່ພົບຂໍ້ມູນພະນັກງານ</p>
      </div>
    )
  }

  const visibleTabs = canManageRoles
    ? TABS
    : TABS.filter((t) => t.key !== 'permissions')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {employee.employeeCode ?? 'ບໍ່ມີລະຫັດ'} •{' '}
            <span>{STATUS_LABELS[employee.status] ?? employee.status}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/hr/employees/${id}/edit`)}>
            ແກ້ໄຂ
          </Button>
          <Button variant="ghost" onClick={() => navigate('/hr/employees')}>
            ກັບຄືນ
          </Button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-6">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              'px-4 py-2 text-sm transition-colors',
              activeTab === tab.key
                ? 'border-b-2 border-primary text-primary font-semibold'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab employee={employee} />}
      {activeTab === 'info' && <PersonalInfoTab employee={employee} />}
      {activeTab === 'salary' && <SalaryTab employee={employee} />}
      {activeTab === 'attendance' && id && <EmployeeAttendanceReport employeeId={id} />}
      {activeTab === 'permissions' && canManageRoles && (
        <PermissionsTab employee={employee} />
      )}

      {activeTab === 'info' && id && <DocumentsSection employeeId={id} documents={documents} />}
    </div>
  )
}
