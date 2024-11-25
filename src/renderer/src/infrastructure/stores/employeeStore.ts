import { create } from 'zustand'
import { Employee } from '@/domain/entities/Employee'

interface EmployeeState {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (employee: Employee) => void
  updateAttendance: (employeeId: string, status: Employee['status']) => void
  updateWorkingHours: (employeeId: string, hours: number) => void
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
    }))
}))
