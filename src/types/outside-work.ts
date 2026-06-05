export type OutsideWorkType =
  | 'OUTSIDE_WORK'
  | 'CUSTOMER_VISIT'
  | 'DELIVERY'
  | 'WORK_FROM_HOME'
  | 'BUSINESS_TRIP'
  | 'EMERGENCY'
  | 'OTHER'

export interface OutsideWorkEmployee {
  id: string
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
}

export interface OutsideWork {
  id: string
  employeeId: string | OutsideWorkEmployee
  employee?: OutsideWorkEmployee
  managerId?: string
  attendanceLogId?: string
  outsideType: OutsideWorkType
  reason: string
  locationName?: string
  photoUrls: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOutsideWorkDto {
  outsideType: OutsideWorkType
  reason: string
  locationName?: string
}
