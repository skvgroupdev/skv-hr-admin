import { useQuery } from '@tanstack/react-query'
import { branchesApi } from '../../api/branches.api'

interface UseBranchesQueryParams {
  page?: number
  limit?: number
  isActive?: boolean
}

export const useBranchesQuery = (params: UseBranchesQueryParams = {}) => {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => branchesApi.list(params),
    staleTime: 30_000,
  })
}
