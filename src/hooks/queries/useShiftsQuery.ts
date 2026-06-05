import { useQuery } from '@tanstack/react-query'
import { shiftsApi } from '../../api/shifts.api'

export const useShiftsQuery = () => {
  return useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftsApi.list(),
    staleTime: 60_000,
  })
}
