import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useMyPayslipsQuery } from '../../../hooks/queries/useMyPayslipsQuery'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'ຮ່າງ', className: 'bg-gray-100 text-gray-500' },
  APPROVED: { label: 'ອະນຸມັດ', className: 'bg-blue-100 text-blue-700' },
  PAID: { label: 'ຈ່າຍແລ້ວ', className: 'bg-green-100 text-green-700' },
}

const LAO_MONTHS = ['ເດືອນ 1', 'ເດືອນ 2', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ', 'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ']

function formatSalary(amount: number): string {
  return amount.toLocaleString('lo-LA') + ' ₭'
}

export default function PayslipListPage() {
  const navigate = useNavigate()
  const { data: payslips, isLoading } = useMyPayslipsQuery()

  return (
    <div>
      <div className="bg-[#0D2B6B] text-white px-5 pt-4 pb-4">
        <p className="text-lg font-bold">ເງິນເດືອນ</p>
      </div>

      <div className="px-4 py-4 space-y-2">
        {isLoading && (
          <>{[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</>
        )}

        {!isLoading && !payslips?.length && (
          <p className="text-center text-gray-400 text-sm mt-8">ຍັງບໍ່ມີ ເງິນເດືອນ</p>
        )}

        {payslips?.map((p) => {
          const statusConf = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.DRAFT
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/employee/payslip/${p.id}`)}
              className="w-full bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between active:scale-95 transition-transform text-left"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {LAO_MONTHS[p.month - 1]} {p.year}
                </p>
                <p className="text-base font-bold text-[#0D2B6B] mt-0.5">{formatSalary(p.netSalary)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConf.className}`}>
                  {statusConf.label}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
