export interface Position {
  id: string
  name: string
  level?: number
  description?: string
  companyId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePositionDto {
  name: string
  level?: number
  description?: string
}

export interface UpdatePositionDto extends Partial<CreatePositionDto> {}
