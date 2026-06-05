export interface TaxBracket {
  from: number
  to: number | null
  rate: number
}

export interface TaxConfig {
  id: string
  country: string
  year: number
  currency: string
  brackets: TaxBracket[]
  employeeSsRate: number
  employerSsRate: number
  effectiveFrom: string
  createdAt: string
}

export interface CreateTaxConfigDto {
  country?: string
  year: number
  currency?: string
  brackets: TaxBracket[]
  employeeSsRate?: number
  employerSsRate?: number
  effectiveFrom: string
}

// ─── Company Tax Config (per-company settings) ───────────────────────────────

export type TaxMode = 'FULL_DEDUCTION' | 'TAX_ON_COMPANY' | 'SS_ONLY' | 'NO_DEDUCTION'

export const TAX_MODE_LABELS: Record<TaxMode, string> = {
  FULL_DEDUCTION: 'ຫັກ SS + ພາສີປົກກະຕິ',
  TAX_ON_COMPANY: 'ບໍລິສັດອອກພາສີໃຫ້ພະນັກງານ',
  SS_ONLY: 'ຫັກແຕ່ SS',
  NO_DEDUCTION: 'ບໍ່ຫັກຫຍັງ',
}

export interface CompanyTaxConfig {
  id: string
  tenantId: string
  taxMode: TaxMode
  enableEmployeeSs: boolean
  enableEmployerSs: boolean
  enableIncomeTax: boolean
  updatedAt: string
}

export interface UpdateCompanyTaxConfigDto {
  taxMode: TaxMode
  enableEmployeeSs: boolean
  enableEmployerSs: boolean
  enableIncomeTax: boolean
}
