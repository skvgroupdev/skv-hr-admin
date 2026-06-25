import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'
import { toast } from '../../components/ui/Toast'

export const useDeleteEmployeeMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      toast.success('ລຶບພະນັກງານສຳເລັດ')
    },
    onError: () => {
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການລຶບພະນັກງານ')
    },
  })
}
