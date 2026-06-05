import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../api/client'

interface PendingCounts {
  leave: number
  ot: number
  outsideWork: number
}

const fetchPendingCounts = async (): Promise<PendingCounts> => {
  const res = await apiClient.get('/dashboard/pending-counts')
  const payload = res.data as { data: PendingCounts }
  return payload.data
}

export const usePendingCountsQuery = () =>
  useQuery({
    queryKey: ['dashboard', 'pending-counts'],
    queryFn: fetchPendingCounts,
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
