export type EmployeeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PROBATION'
  | 'RESIGNED'
  | 'SUSPENDED'
  | 'TERMINATED'

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'

export type DocumentType =
  | 'ID_CARD'
  | 'PASSPORT'
  | 'CONTRACT'
  | 'CV'
  | 'CERTIFICATE'
  | 'MEDICAL'
  | 'OTHER'

export interface PopulatedRef {
  id: string
  name: string
}

export interface AllowanceDto {
  name: string
  amount: number
}

export interface EmergencyContact {
  name: string
  phone: string
  relation?: string
}

export interface BankAccount {
  bank: string
  accountNumber: string
  accountName: string
}

export interface Employee {
  id: string
  userId?: string
  firstName: string
  lastName: string
  firstNameEn?: string
  lastNameEn?: string
  nickname?: string
  phone: string
  gender?: string
  dateOfBirth?: string
  email?: string
  address?: string
  photoUrl?: string
  nationality?: string
  emergencyContact?: EmergencyContact
  employmentType?: EmploymentType
  startDate?: string
  probationEndDate?: string
  branchId?: string
  departmentId?: string
  positionId?: string
  branch?: PopulatedRef
  department?: PopulatedRef
  position?: PopulatedRef
  managerId?: string
  supervisorId?: string
  baseSalary?: number
  allowances?: AllowanceDto[]
  workingHoursPerMonth?: number
  bankAccount?: BankAccount
  paymentMethod?: string
  employeeCode?: string
  role?: 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF'
  status: EmployeeStatus
  companyId: string
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDto {
  firstName: string
  lastName: string
  firstNameEn?: string
  lastNameEn?: string
  nickname?: string
  phone: string
  gender?: string
  dateOfBirth?: string
  email?: string
  address?: string
  photoUrl?: string
  nationality?: string
  emergencyContact?: EmergencyContact
  employmentType?: EmploymentType
  startDate?: string
  probationEndDate?: string
  branchId?: string
  departmentId?: string
  positionId?: string
  managerId?: string
  supervisorId?: string
  baseSalary?: number
  allowances?: AllowanceDto[]
  workingHoursPerMonth?: number
  bankAccount?: BankAccount
  paymentMethod?: string
  employeeCode?: string
  initialPassword?: string
  role?: 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF'
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  newPassword?: string
}

export interface EmployeeDocument {
  id: string
  employeeId: string
  fileUrl: string
  fileName?: string
  fileType?: string
  documentType: DocumentType
  description?: string
  createdAt: string
}

export interface UploadDocumentDto {
  fileUrl: string
  fileName?: string
  fileType?: string
  documentType: DocumentType
  description?: string
}
