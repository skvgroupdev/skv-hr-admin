import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'

export const useActivateCompanyMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => companiesApi.activate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['companies', id] })
    },
  })
}

export const useSuspendCompanyMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => companiesApi.suspend(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['companies', id] })
    },
  })
}
