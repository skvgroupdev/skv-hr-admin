import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { shiftsApi } from '../../../api/shifts.api'
import { useEmployeeShiftHistoryQuery } from '../../../hooks/queries/useEmployeeShiftHistoryQuery'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAuthStore } from '../../../stores/useAuthStore'
import { formatDateOnly } from '../../../utils/date'

type Tab = 'current' | 'history'

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'ກຳລັງໃຊ້',
  INACTIVE: 'ສິ້ນສຸດ',
  PENDING: 'ລໍຖ້າ',
}

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
  PENDING: 'bg-yellow-100 text-yellow-700',
}

export function EmployeeShiftCard({ employeeId }: { employeeId: string }) {
  const qc = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [tab, setTab] = useState<Tab>('current')
  const [shiftId, setShiftId] = useState('')
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10))

  const canAssign = user?.role === 'COMPANY_OWNER' || user?.role === 'HR_ADMIN'
  const enabled = !!user?.features?.shiftManagement

  const { data: shifts = [] } = useQuery({ queryKey: ['shifts'], queryFn: shiftsApi.list, enabled })
  const { data: assignment, isLoading: loadingCurrent } = useQuery({
    queryKey: ['employees', employeeId, 'shift'],
    queryFn: () => shiftsApi.getEmployeeShift(employeeId),
    enabled,
  })
  const { data: history = [], isLoading: loadingHistory } = useEmployeeShiftHistoryQuery(
    tab === 'history' ? employeeId : '',
  )

  const mutation = useMutation({
    mutationFn: () => shiftsApi.assign(shiftId, { employeeId, effectiveDate }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees', employeeId, 'shift'] })
      qc.invalidateQueries({ queryKey: ['employees', employeeId, 'shift', 'history'] })
    },
  })

  if (!enabled) return null

  return (
    <Card>
      <h2 className="font-semibold text-gray-800">ກະເຮັດວຽກ</h2>

      {/* Tabs */}
      <div className="mt-3 flex gap-1 border-b border-gray-200">
        {(['current', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? 'border-b-2 border-[#0D2B6B] text-[#0D2B6B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'current' ? 'ກະປັດຈຸບັນ' : 'ປະຫວັດ'}
          </button>
        ))}
      </div>

      {tab === 'current' && (
        <div className="mt-4">
          {loadingCurrent ? (
            <p className="text-sm text-gray-500">ກຳລັງໂຫຼດ...</p>
          ) : assignment ? (
            <p className="text-sm text-gray-700">
              {assignment.shiftId.name} · {assignment.shiftId.startTime}–{assignment.shiftId.endTime} · ເລີ່ມ{' '}
              {formatDateOnly(assignment.effectiveDate)}
            </p>
          ) : (
            <p className="text-sm text-gray-500">ຍັງບໍ່ມີກະທີ່ມີຜົນ</p>
          )}

          {canAssign && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-2 items-end">
              <label className="text-sm">
                ເລືອກກະ
                <select
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">ເລືອກ</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="ວັນທີເລີ່ມ"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
              <Button
                disabled={!shiftId || !effectiveDate}
                loading={mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                ກຳນົດກະ
              </Button>
            </div>
          )}

          {mutation.isError && (
            <p className="mt-2 text-xs text-red-600">ບໍ່ສາມາດກຳນົດກະໄດ້ ກະລຸນາກວດຊ່ວງວັນທີ</p>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="mt-4">
          {loadingHistory ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 rounded bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">ຍັງບໍ່ມີປະຫວັດກະ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-3 py-2 text-left font-medium">ຊື່ກະ</th>
                    <th className="px-3 py-2 text-left font-medium">ເວລາ</th>
                    <th className="px-3 py-2 text-left font-medium">ວັນເລີ່ມ</th>
                    <th className="px-3 py-2 text-left font-medium">ວັນສິ້ນສຸດ</th>
                    <th className="px-3 py-2 text-left font-medium">ສະຖານະ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item) => {
                    const statusKey = item.status ?? ''
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-800">{item.shiftId.name}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.shiftId.startTime}–{item.shiftId.endTime}
                        </td>
                        <td className="px-3 py-2 text-gray-600">{formatDateOnly(item.effectiveDate)}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.endDate ? formatDateOnly(item.endDate) : '-'}
                        </td>
                        <td className="px-3 py-2">
                          {statusKey ? (
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                STATUS_CLASS[statusKey] ?? 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {STATUS_LABEL[statusKey] ?? statusKey}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
