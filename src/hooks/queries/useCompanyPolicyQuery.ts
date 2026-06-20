import { useQuery } from '@tanstack/react-query'
import { companyPolicyApi } from '../../api/company-policy.api'

export const useCompanyPolicyQuery = () =>
  useQuery({
    queryKey: ['company-policy'],
    queryFn: companyPolicyApi.get,
    staleTime: 5 * 60_000,
  })
