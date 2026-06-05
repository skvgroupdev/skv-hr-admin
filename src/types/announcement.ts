export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED'
export type AnnouncementTargetType = 'ALL' | 'BRANCH' | 'DEPARTMENT' | 'ROLE'

export interface Announcement {
  id: string
  title: string
  content: string
  targetType: AnnouncementTargetType
  targetIds: string[]
  isPinned: boolean
  publishedAt?: string
  status: AnnouncementStatus
  createdBy: string
  readBy: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementDto {
  title: string
  content: string
  targetType?: AnnouncementTargetType
  targetIds?: string[]
  isPinned?: boolean
}

export type UpdateAnnouncementDto = Partial<CreateAnnouncementDto>
