export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string // ISO date string
  status: 'present' | 'absent' | 'late'
  checkIn?: string
  checkOut?: string
  workingHours: number
}
