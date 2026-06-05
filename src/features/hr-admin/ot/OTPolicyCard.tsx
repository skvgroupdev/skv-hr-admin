import { useState } from 'react'
import { useOTPolicyQuery } from '../../../hooks/queries/useOTPolicyQuery'
import { useUpdateOTPolicyMutation } from '../../../hooks/mutations/useOTMutations'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { OTPolicy, UpdateOTPolicyDto } from '../../../types/ot'

function PolicyForm({ policy, onCancel }: { policy: OTPolicy; onCancel: () => void }) {
  const [form, setForm] = useState<UpdateOTPolicyDto>({
    weekdayRate: policy.weekdayRate,
    weekendRate: policy.weekendRate,
    holidayRate: policy.holidayRate,
    minOtMinutes: policy.minOtMinutes,
    maxOtHoursPerDay: policy.maxOtHoursPerDay,
    beforeWorkAllowed: policy.beforeWorkAllowed,
    afterWorkAllowed: policy.afterWorkAllowed,
    requirePreApproval: policy.requirePreApproval,
    compareWithCheckout: policy.compareWithCheckout,
  })

  const updateMutation = useUpdateOTPolicyMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync(form)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Input label="ອັດຕາວັນທຳມະດາ (x)" type="number" step="0.1"
          value={form.weekdayRate?.toString() ?? ''} onChange={(e) => setForm((p) => ({ ...p, weekdayRate: Number(e.target.value) }))} />
        <Input label="ວັນພັກເສົາທິດ (x)" type="number" step="0.1"
          value={form.weekendRate?.toString() ?? ''} onChange={(e) => setForm((p) => ({ ...p, weekendRate: Number(e.target.value) }))} />
        <Input label="ວັນພັກພິເສດ (x)" type="number" step="0.1"
          value={form.holidayRate?.toString() ?? ''} onChange={(e) => setForm((p) => ({ ...p, holidayRate: Number(e.target.value) }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="OT ຕ່ຳສຸດ (ນາທີ)" type="number"
          value={form.minOtMinutes?.toString() ?? ''} onChange={(e) => setForm((p) => ({ ...p, minOtMinutes: Number(e.target.value) }))} />
        <Input label="OT ສູງສຸດ/ວັນ (ຊ.ມ)" type="number"
          value={form.maxOtHoursPerDay?.toString() ?? ''} onChange={(e) => setForm((p) => ({ ...p, maxOtHoursPerDay: Number(e.target.value) }))} />
      </div>
      <div className="flex flex-col gap-2">
        {([
          ['beforeWorkAllowed', 'ອະນຸຍາດ OT ກ່ອນເຂົ້າ'],
          ['afterWorkAllowed', 'ອະນຸຍາດ OT ຫຼັງອອກ'],
          ['requirePreApproval', 'ຕ້ອງຂໍອນຸມັດກ່ອນ'],
          ['compareWithCheckout', 'ປຽບທຽບກັບ checkout'],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={!!form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
              className="rounded" />
            {label}
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>ຍົກເລີກ</Button>
        <Button type="submit" loading={updateMutation.isPending}>ບັນທຶກ</Button>
      </div>
    </form>
  )
}

export function OTPolicyCard() {
  const [editing, setEditing] = useState(false)
  const { data: policy, isLoading } = useOTPolicyQuery()

  if (isLoading) return <Card><div className="h-20 animate-pulse bg-gray-100 rounded" /></Card>
  if (!policy) return null

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">ນະໂຍບາຍ OT</h2>
        {!editing && (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>ແກ້ໄຂ</Button>
        )}
      </div>
      {editing ? (
        <PolicyForm policy={policy} onCancel={() => setEditing(false)} />
      ) : (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-gray-500">ວັນທຳມະດາ</span><p className="font-medium">{policy.weekdayRate}x</p></div>
          <div><span className="text-gray-500">ສຸດທ້ຳ</span><p className="font-medium">{policy.weekendRate}x</p></div>
          <div><span className="text-gray-500">ວັນຫຍຸດ</span><p className="font-medium">{policy.holidayRate}x</p></div>
          <div><span className="text-gray-500">OT ຕ່ຳສຸດ</span><p className="font-medium">{policy.minOtMinutes} ນາທີ</p></div>
          <div><span className="text-gray-500">OT ສູງສຸດ/ວັນ</span><p className="font-medium">{policy.maxOtHoursPerDay} ຊ.ມ</p></div>
          <div><span className="text-gray-500">ຕ້ອງຂໍອນຸມັດ</span><p className="font-medium">{policy.requirePreApproval ? 'ແມ່ນ' : 'ບໍ່'}</p></div>
        </div>
      )}
    </Card>
  )
}
