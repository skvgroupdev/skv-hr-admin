import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'

export const useCompanyUsageQuery = (id: string) => {
  return useQuery({
    queryKey: ['companies', id, 'usage'],
    queryFn: () => companiesApi.usage(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}
