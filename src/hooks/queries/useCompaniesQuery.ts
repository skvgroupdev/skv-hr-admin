import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'

interface UseCompaniesQueryParams {
  page?: number
  limit?: number
}

export const useCompaniesQuery = (params: UseCompaniesQueryParams = {}) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.list(params),
    staleTime: 30_000,
  })
}
