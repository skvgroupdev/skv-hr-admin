import { useState, useEffect, useMemo } from 'react'
import { Search, Users, CheckCircle, XCircle } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useShiftsQuery } from '../../../hooks/queries/useShiftsQuery'
import { useEmployeesQuery } from '../../../hooks/queries/useEmployeesQuery'
import { useBulkAssignShiftMutation } from '../../../hooks/mutations/useShiftMutations'
import type { BulkAssignResult } from '../../../types/shift'
import { cn } from '../../../lib/cn'

interface BulkAssignShiftModalProps {
  open: boolean
  onClose: () => void
}

interface FormState {
  shiftId: string
  effectiveDate: string
  endDate: string
}

// Shows the result summary after a successful bulk assign
function ResultSummary({
  result,
  onClose,
}: {
  result: BulkAssignResult
  onClose: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 flex-1">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">ສຳເລັດ</p>
            <p className="text-xl font-bold text-green-700">{result.success.length} ຄົນ</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 flex-1">
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">ລົ້ມເຫລວ</p>
            <p className="text-xl font-bold text-red-700">{result.failed.length} ຄົນ</p>
          </div>
        </div>
      </div>

      {result.failed.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800 mb-2">ລາຍລະອຽດທີ່ລົ້ມເຫລວ</p>
          <ul className="space-y-1">
            {result.failed.map((f) => (
              <li key={f.employeeId} className="text-xs text-red-700">
                ID: {f.employeeId} — {f.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={onClose}>ປິດ</Button>
      </div>
    </div>
  )
}

export function BulkAssignShiftModal({ open, onClose }: BulkAssignShiftModalProps) {
  const [form, setForm] = useState<FormState>({ shiftId: '', effectiveDate: '', endDate: '' })
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set())
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [result, setResult] = useState<BulkAssignResult | null>(null)
  const [error, setError] = useState('')

  const { data: shifts } = useShiftsQuery()
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployeesQuery({
    limit: 200,
    status: 'ACTIVE',
  })
  const bulkAssignMutation = useBulkAssignShiftMutation()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setForm({ shiftId: '', effectiveDate: '', endDate: '' })
      setSelectedEmployeeIds(new Set())
      setEmployeeSearch('')
      setResult(null)
      setError('')
    }
  }, [open])

  const activeShifts = useMemo(
    () => shifts?.filter((s) => s.isActive) ?? [],
    [shifts],
  )

  const filteredEmployees = useMemo(() => {
    const employees = employeesData?.data ?? []
    if (!employeeSearch.trim()) return employees
    const query = employeeSearch.toLowerCase()
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase()
      return fullName.includes(query) || emp.phone.includes(query)
    })
  }, [employeesData, employeeSearch])

  const toggleEmployee = (id: string) => {
    setSelectedEmployeeIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedEmployeeIds.size === filteredEmployees.length) {
      setSelectedEmployeeIds(new Set())
    } else {
      setSelectedEmployeeIds(new Set(filteredEmployees.map((e) => e.id)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.shiftId) { setError('ກະລຸນາເລືອກກະ'); return }
    if (!form.effectiveDate) { setError('ກະລຸນາເລືອກວັນທີເລີ່ມຕົ້ນ'); return }
    if (selectedEmployeeIds.size === 0) { setError('ກະລຸນາເລືອກພະນັກງານຢ່າງໜ້ອຍ 1 ຄົນ'); return }

    try {
      const assignResult = await bulkAssignMutation.mutateAsync({
        shiftId: form.shiftId,
        employeeIds: Array.from(selectedEmployeeIds),
        effectiveDate: form.effectiveDate,
        endDate: form.endDate || undefined,
      })
      setResult(assignResult)
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  const allFilteredSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((e) => selectedEmployeeIds.has(e.id))

  return (
    <Modal open={open} title="ກຳນົດກະໝູ່" onClose={onClose}>
      {result ? (
        <ResultSummary result={result} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shift selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ເລືອກກະ <span className="text-red-500">*</span>
            </label>
            <select
              value={form.shiftId}
              onChange={(e) => setForm((prev) => ({ ...prev, shiftId: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B] bg-white"
            >
              <option value="">-- ເລືອກກະ --</option>
              {activeShifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                  {shift.startTime && shift.endTime
                    ? ` (${shift.startTime} – ${shift.endTime})`
                    : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Date pickers */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="ວັນທີເລີ່ມຕົ້ນ *"
              type="date"
              value={form.effectiveDate}
              onChange={(e) => setForm((prev) => ({ ...prev, effectiveDate: e.target.value }))}
            />
            <Input
              label="ວັນທີສິ້ນສຸດ (ຖ້າມີ)"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          {/* Employee multi-select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">
                ເລືອກພະນັກງານ <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">
                ເລືອກແລ້ວ {selectedEmployeeIds.size} ຄົນ
              </span>
            </div>

            {/* Search box */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="ຄົ້ນຫາຊື່ຫຼືເບີໂທ..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]"
              />
            </div>

            {/* Select all row */}
            {filteredEmployees.length > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 mb-1 cursor-pointer select-none"
                onClick={toggleAll}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={allFilteredSelected}
                  className="rounded"
                />
                <span className="text-xs font-medium text-gray-600">ເລືອກທັງໝົດ ({filteredEmployees.length} ຄົນ)</span>
              </div>
            )}

            {/* Employee list */}
            <div className="h-48 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100">
              {isLoadingEmployees ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 flex-1 rounded bg-gray-200 animate-pulse" />
                  </div>
                ))
              ) : filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                  <Users className="h-8 w-8 text-gray-300 mb-1" />
                  <p className="text-sm text-gray-400">ບໍ່ພົບພະນັກງານ</p>
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors select-none',
                      selectedEmployeeIds.has(emp.id) && 'bg-blue-50',
                    )}
                    onClick={() => toggleEmployee(emp.id)}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={selectedEmployeeIds.has(emp.id)}
                      className="rounded"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {emp.phone}
                        {emp.department ? ` · ${emp.department.name}` : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              ຍົກເລີກ
            </Button>
            <Button type="submit" loading={bulkAssignMutation.isPending}>
              ກຳນົດກະ ({selectedEmployeeIds.size} ຄົນ)
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
