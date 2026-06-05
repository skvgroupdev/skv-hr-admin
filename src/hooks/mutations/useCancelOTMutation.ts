import { useMutation, useQueryClient } from '@tanstack/react-query'
import { otApi } from '../../api/ot.api'
import { toast } from '../../components/ui/Toast'

export const useCancelOTMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => otApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ot', 'my'] })
      toast.success('ຍົກເລີກ OT ສຳເລັດ')
    },
    onError: () => {
      toast.error('ບໍ່ສາມາດຍົກເລີກ OT ໄດ້')
    },
  })
}
