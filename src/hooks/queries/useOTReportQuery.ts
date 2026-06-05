import { useQuery } from '@tanstack/react-query'
import { otApi } from '../../api/ot.api'

interface OTReportParams {
  page?: number
  status?: string
  year?: number
  month?: number
}

export const useOTReportQuery = (params: OTReportParams = {}) => {
  return useQuery({
    queryKey: ['ot', 'report', params],
    queryFn: () => otApi.getReport(params),
    staleTime: 30_000,
  })
}
