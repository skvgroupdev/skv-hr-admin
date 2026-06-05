import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'
import type { UploadDocumentDto } from '../../types/employee'

interface UploadDocumentVars {
  employeeId: string
  body: UploadDocumentDto
}

export const useUploadDocumentMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ employeeId, body }: UploadDocumentVars) =>
      employeesApi.uploadDocument(employeeId, body),
    onSuccess: (_data, { employeeId }) => {
      qc.invalidateQueries({ queryKey: ['employees', employeeId, 'documents'] })
    },
  })
}
