import { Employee } from '../entities/Employee'

export interface IEmployeeRepository {
  getEmployees(): Promise<Employee[]>
  updateEmployee(employee: Employee): Promise<void>
  updateAttendance(employeeId: string, status: Employee['status']): Promise<void>
  updateWorkingHours(employeeId: string, hours: number): Promise<void>
}
