export interface BranchLocation {
  coordinates: [number, number] // [lng, lat]
}

export interface Branch {
  id: string
  name: string
  code?: string
  address?: string
  location?: BranchLocation
  radiusMeters?: number
  phone?: string
  managerId?: string
  isActive: boolean
  workingPolicy?: string
  companyId: string
  createdAt: string
  updatedAt: string
}

export interface CreateBranchDto {
  name: string
  code?: string
  address?: string
  location?: BranchLocation
  radiusMeters?: number
  phone?: string
  managerId?: string
  isActive?: boolean
  workingPolicy?: string
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {}
