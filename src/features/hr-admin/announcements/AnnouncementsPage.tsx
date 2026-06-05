import { useState } from 'react'
import { Plus, Pin } from 'lucide-react'
import { useAnnouncementsQuery } from '../../../hooks/queries/useAnnouncementsQuery'
import {
  useDeleteAnnouncementM,
  usePublishAnnouncementM,
} from '../../../hooks/mutations/useAnnouncementMutations'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { cn } from '../../../lib/cn'
import { AnnouncementFormModal } from './AnnouncementFormModal'
import type { Announcement } from '../../../types/announcement'
import { formatDateOnly } from '../../../utils/date'

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
  PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'ແບບຮ່າງ',
  PUBLISHED: 'ເຜີຍແຜ່ແລ້ວ',
}

const TARGET_LABELS: Record<string, string> = {
  ALL: 'ທຸກຄົນ',
  BRANCH: 'ສາຂາ',
  DEPARTMENT: 'ພະແນກ',
  ROLE: 'ຕໍາແໜ່ງ',
}

function AnnouncementRow({
  item,
  onEdit,
}: {
  item: Announcement
  onEdit: (a: Announcement) => void
}) {
  const deleteM = useDeleteAnnouncementM()
  const publishM = usePublishAnnouncementM()

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {item.isPinned && <Pin className="h-3.5 w-3.5 text-orange-400 shrink-0" />}
          <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{TARGET_LABELS[item.targetType]}</td>
      <td className="px-4 py-3">
        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border', STATUS_STYLES[item.status])}>
          {STATUS_LABELS[item.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDateOnly(item.createdAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {item.status === 'DRAFT' && (
            <Button
              size="sm"
              variant="primary"
              loading={publishM.isPending}
              onClick={() => publishM.mutate(item.id)}
            >
              ເຜີຍແຜ່
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>ແກ້ໄຂ</Button>
          <Button
            size="sm"
            variant="danger"
            loading={deleteM.isPending}
            onClick={() => { if (confirm('ລຶບປະກາດນີ້?')) deleteM.mutate(item.id) }}
          >
            ລຶບ
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function AnnouncementsPage() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Announcement | undefined>()
  const { data, isLoading } = useAnnouncementsQuery(page)

  const HEADERS = ['ຫົວຂໍ້', 'ກຸ່ມເປົ້າໝາຍ', 'ສະຖານະ', 'ວັນທີສ້າງ', 'ການຈັດການ']

  const openCreate = () => { setEditingItem(undefined); setModalOpen(true) }
  const openEdit = (a: Announcement) => { setEditingItem(a); setModalOpen(true) }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">ປະກາດ</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          ສ້າງປະກາດ
        </Button>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                {HEADERS.map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {HEADERS.map((h) => (
                      <td key={h} className="px-4 py-3">
                        <div className="h-4 rounded bg-gray-200 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length} className="py-12 text-center text-sm text-gray-500">
                    ຍັງບໍ່ມີປະກາດ
                  </td>
                </tr>
              ) : (
                data?.data.map((item) => (
                  <AnnouncementRow key={item.id} item={item} onEdit={openEdit} />
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.meta && (
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            onPageChange={setPage}
          />
        )}
      </Card>

      <AnnouncementFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        announcement={editingItem}
      />
    </div>
  )
}
