export type PaymentType = 'daily' | 'hourly'
export type PrimeType = 'performance' | 'attendance' | 'other'

export interface EmployeeBenefits {
  prime: number
  conges: number
  congesRate: number // Pay rate during congés
  primeType: PrimeType
  lastPrimeDate?: string
  lastCongesDate?: string
}

export interface Employee {
  id: string
  name: string
  type: 'declared' | 'undeclared'
  status: 'present' | 'absent' | 'late'
  position: string
  checkIn?: string
  checkOut?: string
  workingHours: number
  paymentType: PaymentType
  rate: number
  contractType?: 'full-time' | 'part-time' | 'contract'
  startDate?: string
  benefits: EmployeeBenefits
}
