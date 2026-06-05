import { useMutation } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'
import type { CreateOwnerRequest } from '../../types/company'

export const useCreateOwnerMutation = (companyId: string) => {
  return useMutation({
    mutationFn: (body: CreateOwnerRequest) => companiesApi.createOwner(companyId, body),
  })
}
