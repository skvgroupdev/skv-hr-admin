import { useQuery } from '@tanstack/react-query'
import { outsideWorkApi } from '../../api/outside-work.api'

interface OutsideWorkReportParams {
  page?: number
  status?: string
}

export const useOutsideWorkReportQuery = (params: OutsideWorkReportParams = {}) => {
  return useQuery({
    queryKey: ['outside-work', 'report', params],
    queryFn: () => outsideWorkApi.getReport(params),
    staleTime: 30_000,
  })
}
