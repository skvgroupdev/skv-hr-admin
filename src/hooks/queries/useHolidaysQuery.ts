import { useQuery } from '@tanstack/react-query'
import { holidaysApi } from '../../api/holidays.api'

interface HolidayQueryParams {
  year?: number
  type?: 'PUBLIC' | 'COMPANY'
  page?: number
}

export const useHolidaysQuery = (params: HolidayQueryParams = {}) => {
  return useQuery({
    queryKey: ['holidays', params],
    queryFn: () => holidaysApi.list(params),
    staleTime: 60_000,
  })
}
