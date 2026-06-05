import { useQuery } from '@tanstack/react-query'
import { taxConfigsApi, companyTaxConfigApi } from '../../api/tax-configs.api'

export const useTaxConfigsQuery = () => {
  return useQuery({
    queryKey: ['tax-configs'],
    queryFn: () => taxConfigsApi.list(),
    staleTime: 5 * 60_000,
  })
}

export const useCurrentTaxConfigQuery = () => {
  return useQuery({
    queryKey: ['tax-configs', 'current'],
    queryFn: () => taxConfigsApi.getCurrent(),
    staleTime: 5 * 60_000,
  })
}

export const useMyTaxConfigQuery = () => {
  return useQuery({
    queryKey: ['company-tax-config', 'mine'],
    queryFn: () => companyTaxConfigApi.getMyConfig(),
    staleTime: 5 * 60_000,
  })
}

export const useAllTaxConfigsQuery = () => {
  return useQuery({
    queryKey: ['company-tax-config', 'all'],
    queryFn: () => companyTaxConfigApi.getAllConfigs(),
    staleTime: 5 * 60_000,
  })
}
