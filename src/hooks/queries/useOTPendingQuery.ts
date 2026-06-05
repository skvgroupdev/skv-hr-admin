import { useQuery } from '@tanstack/react-query'
import { otApi } from '../../api/ot.api'

export const useOTPendingQuery = () => {
  return useQuery({
    queryKey: ['ot', 'pending'],
    queryFn: () => otApi.getPending(),
    staleTime: 30_000,
  })
}
