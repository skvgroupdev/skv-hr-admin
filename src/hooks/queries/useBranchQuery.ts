import { useQuery } from '@tanstack/react-query'
import { branchesApi } from '../../api/branches.api'

export const useBranchQuery = (id: string) => {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: () => branchesApi.getById(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}
