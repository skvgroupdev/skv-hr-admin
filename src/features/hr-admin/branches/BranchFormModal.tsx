import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { MapPicker } from './MapPicker'
import { useCreateBranchMutation } from '../../../hooks/mutations/useCreateBranchMutation'
import { useUpdateBranchMutation } from '../../../hooks/mutations/useUpdateBranchMutation'
import type { Branch } from '../../../types/branch'
import { useEmployeesQuery } from '../../../hooks/queries/useEmployeesQuery'
import { branchesApi } from '../../../api/branches.api'

interface BranchFormModalProps {
  open: boolean
  onClose: () => void
  branch?: Branch
}

interface FormState {
  name: string
  code: string
  address: string
  phone: string
  radiusMeters: string
  coords: [number, number] | undefined // [lat, lng]
  isActive: boolean
  managerEmployeeId: string
}

function getInitialForm(branch?: Branch): FormState {
  const lat = branch?.location?.coordinates[1]
  const lng = branch?.location?.coordinates[0]
  return {
    name: branch?.name ?? '',
    code: branch?.code ?? '',
    address: branch?.address ?? '',
    phone: branch?.phone ?? '',
    radiusMeters: branch?.radiusMeters?.toString() ?? '',
    coords: lat != null && lng != null ? [lat, lng] : undefined,
    isActive: branch?.isActive ?? true,
    managerEmployeeId: '',
  }
}

function buildPayload(form: FormState) {
  const [lat, lng] = form.coords!
  return {
    name: form.name.trim(),
    code: form.code.trim() || undefined,
    address: form.address.trim() || undefined,
    phone: form.phone.trim() || undefined,
    radiusMeters: form.radiusMeters ? Number(form.radiusMeters) : undefined,
    // GeoJSON: coordinates = [longitude, latitude]
    location: { coordinates: [lng, lat] as [number, number] },
    isActive: form.isActive,
  }
}

export function BranchFormModal({ open, onClose, branch }: BranchFormModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(branch))
  const [error, setError] = useState('')

  const createMutation = useCreateBranchMutation()
  const updateMutation = useUpdateBranchMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending
  const isEdit = !!branch
  const { data: employeesData } = useEmployeesQuery({ limit: 100, status: 'ACTIVE' })

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(branch))
      setError('')
    }
  }, [open, branch])

  useEffect(() => {
    if (!open || !branch?.managerId || !employeesData?.data) return
    const manager = employeesData.data.find((employee) => employee.userId === branch.managerId)
    if (manager) setForm((current) => ({ ...current, managerEmployeeId: manager.id }))
  }, [open, branch, employeesData])

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleMapChange = (coords: [number, number]) => {
    setForm((prev) => ({ ...prev, coords }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('ກະລຸນາໃສ່ຊື່ສາຂາ')
      return
    }
    if (!form.coords) {
      setError('ກະລຸນາປັກໝຸດຕຳແໜ່ງສາຂາໃນແຜນທີ່')
      return
    }

    try {
      const body = buildPayload(form)
      let savedBranch: Branch
      if (isEdit) {
        savedBranch = await updateMutation.mutateAsync({ id: branch.id, body })
      } else {
        savedBranch = await createMutation.mutateAsync(body)
      }
      if (form.managerEmployeeId) {
        await branchesApi.assignManager(savedBranch.id, form.managerEmployeeId)
      }
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂສາຂາ' : 'ສ້າງສາຂາໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ຊື່ສາຂາ *"
          value={form.name}
          onChange={setField('name')}
          placeholder="ຊື່ສາຂາ"
        />
        <Input
          label="ລະຫັດສາຂາ"
          value={form.code}
          onChange={setField('code')}
          placeholder="ລະຫັດສາຂາ"
        />
        <Input
          label="ທີ່ຢູ່"
          value={form.address}
          onChange={setField('address')}
          placeholder="ທີ່ຢູ່ສາຂາ"
        />
        <Input
          label="ເບີໂທ"
          value={form.phone}
          onChange={setField('phone')}
          placeholder="ເບີໂທສາຂາ"
        />
        <Input
          label="ລັດສະໝີ (ແມັດ)"
          type="number"
          value={form.radiusMeters}
          onChange={setField('radiusMeters')}
          placeholder="500"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ຫົວໜ້າສາຂາ</label>
          <select
            value={form.managerEmployeeId}
            onChange={(event) => setForm((current) => ({ ...current, managerEmployeeId: event.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">ຍັງບໍ່ກຳນົດ</option>
            {employeesData?.data.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}{employee.nickname ? ` (${employee.nickname})` : ''}
              </option>
            ))}
          </select>
        </div>

        <MapPicker value={form.coords} onChange={handleMapChange} />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={setField('isActive')}
            className="rounded border-gray-300"
          />
          ເປີດໃຊ້ງານ
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            ຍົກເລີກ
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEdit ? 'ບັນທຶກ' : 'ສ້າງສາຂາ'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
