import { useQuery } from '@tanstack/react-query'
import { otApi } from '../../api/ot.api'

export const useOTPolicyQuery = () => {
  return useQuery({
    queryKey: ['ot', 'policy'],
    queryFn: () => otApi.getPolicy(),
    staleTime: 60_000,
  })
}
