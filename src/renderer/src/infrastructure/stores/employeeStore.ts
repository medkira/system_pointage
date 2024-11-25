import { create } from 'zustand'
import { Employee } from '@/domain/entities/Employee'
import { AttendanceRecord } from '@/domain/entities/Attendance'

interface EmployeeState {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (employee: Employee) => void
  updateAttendance: (employeeId: string, status: Employee['status']) => void
  updateWorkingHours: (employeeId: string, hours: number) => void
  selectedDate: string // ISO date string
  attendanceRecords: AttendanceRecord[]
  setSelectedDate: (date: string) => void
  updateAttendanceForDate: (
    employeeId: string,
    date: string,
    status: AttendanceRecord['status'],
    data?: Partial<AttendanceRecord>
  ) => void
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  isLoading: false,
  error: null,
  setEmployees: (employees) => set({ employees }),
  addEmployee: (newEmployee) => {
    console.log('Adding employee:', newEmployee)
    set((state) => ({
      employees: [...state.employees, newEmployee]
    }))
  },
  updateEmployee: (updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    })),
  updateAttendance: (employeeId, status) =>
    set((state) => ({
      employees: state.employees.map((emp) => (emp.id === employeeId ? { ...emp, status } : emp))
    })),
  updateWorkingHours: (employeeId, hours) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === employeeId ? { ...emp, workingHours: hours } : emp
      )
    })),
  selectedDate: new Date().toISOString().split('T')[0],
  attendanceRecords: [],
  setSelectedDate: (date) => set({ selectedDate: date }),
  updateAttendanceForDate: (employeeId, date, status, data) =>
    set((state) => {
      const existingRecord = state.attendanceRecords.find(
        (record) => record.employeeId === employeeId && record.date === date
      )

      const newRecord: AttendanceRecord = {
        id: existingRecord?.id || `ATT${Math.random().toString(36).slice(2)}`,
        employeeId,
        date,
        status,
        workingHours: data?.workingHours || existingRecord?.workingHours || 0,
        checkIn: data?.checkIn || existingRecord?.checkIn,
        checkOut: data?.checkOut || existingRecord?.checkOut
      }

      const updatedRecords = existingRecord
        ? state.attendanceRecords.map((record) =>
            record.id === existingRecord.id ? newRecord : record
          )
        : [...state.attendanceRecords, newRecord]

      return { attendanceRecords: updatedRecords }
    })
}))
