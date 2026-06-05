import { useQuery } from '@tanstack/react-query'
import { announcementsApi } from '../../api/announcements.api'

export const useAnnouncementsQuery = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['announcements', { page, limit }],
    queryFn: () => announcementsApi.list(page, limit),
    staleTime: 60_000,
  })
}

export const useAnnouncementQuery = (id: string) => {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => announcementsApi.getOne(id),
    staleTime: 60_000,
    enabled: !!id,
  })
}
