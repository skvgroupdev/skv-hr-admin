import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useCreateAnnouncementM, useUpdateAnnouncementM } from '../../../hooks/mutations/useAnnouncementMutations'
import type { Announcement, CreateAnnouncementDto } from '../../../types/announcement'

interface AnnouncementFormModalProps {
  open: boolean
  onClose: () => void
  announcement?: Announcement
}

const EMPTY_FORM: CreateAnnouncementDto = {
  title: '',
  content: '',
  targetType: 'ALL',
  isPinned: false,
}

export function AnnouncementFormModal({ open, onClose, announcement }: AnnouncementFormModalProps) {
  const [form, setForm] = useState<CreateAnnouncementDto>(EMPTY_FORM)
  const createM = useCreateAnnouncementM()
  const updateM = useUpdateAnnouncementM()

  useEffect(() => {
    if (announcement) {
      setForm({
        title: announcement.title,
        content: announcement.content,
        targetType: announcement.targetType,
        isPinned: announcement.isPinned,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [announcement, open])

  const isLoading = createM.isPending || updateM.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (announcement) {
      updateM.mutate({ id: announcement.id, body: form }, { onSuccess: onClose })
    } else {
      createM.mutate(form, { onSuccess: onClose })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {announcement ? 'ແກ້ໄຂປະກາດ' : 'ສ້າງປະກາດໃໝ່'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">ຫົວຂໍ້</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">ເນື້ອຫາ</label>
            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">ກຸ່ມເປົ້າໝາຍ</label>
            <select
              value={form.targetType}
              onChange={(e) => setForm((p) => ({ ...p, targetType: e.target.value as CreateAnnouncementDto['targetType'] }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">ທຸກຄົນ</option>
              <option value="BRANCH">ສາຂາ</option>
              <option value="DEPARTMENT">ພະແນກ</option>
              <option value="ROLE">ຕໍາແໜ່ງ</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setForm((p) => ({ ...p, isPinned: e.target.checked }))}
              className="rounded border-gray-300"
            />
            ປັກໝຸດ (Pinned)
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>ຍົກເລີກ</Button>
            <Button type="submit" loading={isLoading}>
              {announcement ? 'ບັນທຶກ' : 'ສ້າງ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
