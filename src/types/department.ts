export interface Department {
  id: string
  name: string
  description?: string
  headId?: string
  companyId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentDto {
  name: string
  description?: string
  headId?: string
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}
