import { apiClient } from './client'

interface UploadResult {
  url: string
  key: string
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

const buildFormData = (file: File, oldKey?: string): FormData => {
  const form = new FormData()
  form.append('file', file)
  if (oldKey) form.append('oldKey', oldKey)
  return form
}

const multipartHeaders = { 'Content-Type': 'multipart/form-data' }

export const uploadApi = {
  uploadFile: async (file: File, type?: string): Promise<UploadResult> => {
    const res = await apiClient.post('/uploads', buildFormData(file), {
      params: type ? { type } : {},
      headers: multipartHeaders,
    })
    return unwrap<UploadResult>(res)
  },

  deleteFile: async (key: string): Promise<void> => {
    await apiClient.delete('/uploads', { params: { key } })
  },

  updateFile: async (oldKey: string, file: File, type?: string): Promise<UploadResult> => {
    const res = await apiClient.patch('/uploads', buildFormData(file, oldKey), {
      params: type ? { type } : {},
      headers: multipartHeaders,
    })
    return unwrap<UploadResult>(res)
  },
}
