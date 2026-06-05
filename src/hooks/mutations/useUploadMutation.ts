import { useMutation } from '@tanstack/react-query'
import { uploadApi } from '../../api/upload.api'

interface UploadResult {
  url: string
  key: string
}

interface UseUploadMutationOptions {
  onSuccess?: (result: UploadResult) => void
}

export const useUploadMutation = (options?: UseUploadMutationOptions) => {
  const upload = useMutation({
    mutationFn: ({ file, type }: { file: File; type?: string }) =>
      uploadApi.uploadFile(file, type),
    onSuccess: (result) => options?.onSuccess?.(result),
  })

  const remove = useMutation({
    mutationFn: ({ key }: { key: string }) => uploadApi.deleteFile(key),
  })

  const update = useMutation({
    mutationFn: ({ oldKey, file, type }: { oldKey: string; file: File; type?: string }) =>
      uploadApi.updateFile(oldKey, file, type),
    onSuccess: (result) => options?.onSuccess?.(result),
  })

  return { upload, remove, update }
}
