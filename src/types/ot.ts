export interface OTPolicy {
  id: string
  weekdayRate: number
  weekendRate: number
  holidayRate: number
  beforeWorkAllowed: boolean
  afterWorkAllowed: boolean
  minOtMinutes: number
  maxOtHoursPerDay: number
  requirePreApproval: boolean
  compareWithCheckout: boolean
}

export interface OTApproval {
  approverId: string
  role: string
  status: string
  comment?: string
  approvedAt?: string
}

export interface OTRequest {
  id: string
  employeeId: string
  date: string
  startTime: string
  endTime: string
  totalHours: number
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  approvalFlow: OTApproval[]
  createdAt: string
  updatedAt: string
}

export interface CreateOTRequestDto {
  date: string
  startTime: string
  endTime: string
  reason: string
}

export interface UpdateOTPolicyDto {
  weekdayRate?: number
  weekendRate?: number
  holidayRate?: number
  beforeWorkAllowed?: boolean
  afterWorkAllowed?: boolean
  minOtMinutes?: number
  maxOtHoursPerDay?: number
  requirePreApproval?: boolean
  compareWithCheckout?: boolean
}
