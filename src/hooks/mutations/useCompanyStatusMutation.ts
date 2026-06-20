import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '../../api/companies.api'
import type {
  AssignPlanRequest,
  UpdateSubscriptionRequest,
} from '../../types/company'

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

export const useAssignCompanyPlanMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssignPlanRequest }) =>
      companiesApi.assignPlan(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['companies', id] })
      qc.invalidateQueries({ queryKey: ['companies', id, 'usage'] })
    },
  })
}

export const useUpdateCompanySubscriptionMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSubscriptionRequest }) =>
      companiesApi.updateSubscription(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['companies', id] })
      qc.invalidateQueries({ queryKey: ['companies', id, 'usage'] })
    },
  })
}

export const useExtendCompanySubscriptionMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Pick<UpdateSubscriptionRequest, 'endDate' | 'isPaid'>
    }) => companiesApi.extendSubscription(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['companies', id] })
      qc.invalidateQueries({ queryKey: ['companies', id, 'usage'] })
    },
  })
}
