import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taxConfigsApi, companyTaxConfigApi } from '../../api/tax-configs.api'
import type { CreateTaxConfigDto, UpdateCompanyTaxConfigDto } from '../../types/tax-config'
import { toast } from '../../components/ui/Toast'

export const useCreateTaxConfigMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTaxConfigDto) => taxConfigsApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tax-configs'] }) },
  })
}

export const useUpdateTaxConfigMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateTaxConfigDto> }) =>
      taxConfigsApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tax-configs'] }) },
  })
}

export const useUpdateMyTaxConfigMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateCompanyTaxConfigDto) => companyTaxConfigApi.updateMyConfig(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-tax-config'] })
      toast.success('ບັນທຶກການຕັ້ງຄ່າພາສີສຳເລັດ')
    },
    onError: () => { toast.error('ບໍ່ສາມາດບັນທຶກໄດ້ ກະລຸນາລອງໃໝ່') },
  })
}

export const useUpdateCompanyTaxConfigMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tenantId, dto }: { tenantId: string; dto: UpdateCompanyTaxConfigDto }) =>
      companyTaxConfigApi.updateConfig(tenantId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['company-tax-config'] }) },
  })
}
