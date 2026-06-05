import { useMutation, useQueryClient } from '@tanstack/react-query'
import { announcementsApi } from '../../api/announcements.api'
import type { CreateAnnouncementDto, UpdateAnnouncementDto } from '../../types/announcement'

export const useCreateAnnouncementM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateAnnouncementDto) => announcementsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useUpdateAnnouncementM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAnnouncementDto }) =>
      announcementsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useDeleteAnnouncementM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => announcementsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const usePublishAnnouncementM = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => announcementsApi.publish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
