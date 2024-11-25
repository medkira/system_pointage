export type PaymentType = 'daily' | 'hourly'

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
}
