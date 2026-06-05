import { apiClient } from './client'
import type { Announcement, CreateAnnouncementDto, UpdateAnnouncementDto } from '../types/announcement'
import type { PaginatedResponse } from '../types/company'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const announcementsApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<Announcement>> => {
    const res = await apiClient.get('/announcements', { params: { page, limit } })
    return res.data as PaginatedResponse<Announcement>
  },

  getOne: async (id: string): Promise<Announcement> => {
    const res = await apiClient.get(`/announcements/${id}`)
    return unwrap<Announcement>(res)
  },

  create: async (body: CreateAnnouncementDto): Promise<Announcement> => {
    const res = await apiClient.post('/announcements', body)
    return unwrap<Announcement>(res)
  },

  update: async (id: string, body: UpdateAnnouncementDto): Promise<Announcement> => {
    const res = await apiClient.patch(`/announcements/${id}`, body)
    return unwrap<Announcement>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/announcements/${id}`)
  },

  publish: async (id: string): Promise<Announcement> => {
    const res = await apiClient.post(`/announcements/${id}/publish`)
    return unwrap<Announcement>(res)
  },
}
