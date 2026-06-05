import { useNavigate } from 'react-router-dom'
import type { Company } from '../../../types/company'
import { StatusBadge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import {
  useActivateCompanyMutation,
  useSuspendCompanyMutation,
} from '../../../hooks/mutations/useCompanyStatusMutation'
import { toast } from '../../../components/ui/Toast'
import { formatDateOnly } from '../../../utils/date'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const navigate = useNavigate()
  const activateMutation = useActivateCompanyMutation()
  const suspendMutation = useSuspendCompanyMutation()

  const handleActivate = async () => {
    try {
      await activateMutation.mutateAsync(company.id)
      toast.success('ເປີດໃຊ້ບໍລິສັດສຳເລັດ')
    } catch {
      toast.error('ບໍ່ສາມາດເປີດໃຊ້ໄດ້ ກະລຸນາລອງໃໝ່')
    }
  }

  const handleSuspend = async () => {
    try {
      await suspendMutation.mutateAsync(company.id)
      toast.success('ລະງັບບໍລິສັດສຳເລັດ')
    } catch {
      toast.error('ບໍ່ສາມາດລະງັບໄດ້ ກະລຸນາລອງໃໝ່')
    }
  }

  const formattedDate = formatDateOnly(company.createdAt)

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{company.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{company.email ?? '—'}</td>
      <td className="px-4 py-3">
        <StatusBadge status={company.status} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formattedDate}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/super/companies/${company.id}`)}
          >
            ລາພັກຍລະອຽດ
          </Button>

          {company.status === 'ACTIVE' || company.status === 'TRIAL' ? (
            <Button
              variant="danger"
              size="sm"
              loading={suspendMutation.isPending}
              onClick={handleSuspend}
            >
              ລະງັບ
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              loading={activateMutation.isPending}
              onClick={handleActivate}
            >
              ເປີດໃຊ້
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
