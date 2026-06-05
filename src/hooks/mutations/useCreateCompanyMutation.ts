import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'
import type { CreateCompanyRequest } from '../../types/company'

export const useCreateCompanyMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateCompanyRequest) => companiesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
