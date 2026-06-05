import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'

export const useCompanyQuery = (id: string) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companiesApi.getById(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}
