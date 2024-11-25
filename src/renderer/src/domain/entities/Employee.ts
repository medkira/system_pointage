export interface Employee {
  id: string
  name: string
  type: 'declared' | 'undeclared'
  dailyRate: number
  status: 'present' | 'absent' | 'late'
  position: string
  checkIn?: string
  checkOut?: string
  workingHours: number
}
