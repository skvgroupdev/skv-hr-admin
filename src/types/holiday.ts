export interface Holiday {
  id: string
  name: string
  date: string
  type: 'PUBLIC' | 'COMPANY'
  isActive: boolean
  createdAt: string
}

export interface CreateHolidayDto {
  name: string
  date: string
  type: 'PUBLIC' | 'COMPANY'
  isActive?: boolean
}

export interface UpdateHolidayDto extends Partial<CreateHolidayDto> {}
