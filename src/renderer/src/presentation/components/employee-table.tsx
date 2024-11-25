import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/presentation/components/ui/table'
import { Button } from '@/presentation/components/ui/button'
import { EmployeeFormDialog } from './employee-form-dialog'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import { cn } from '../lib/utils'
import { Employee } from '@/domain/entities/Employee'

interface EmployeeTableProps {
  type: 'declared' | 'undeclared'
}

export function EmployeeTable({ type }: EmployeeTableProps) {
  const { employees } = useEmployeeStore()
  const filteredEmployees = employees.filter((emp) => emp.type === type)

  const formatRate = (employee: Employee) => {
    return employee.paymentType === 'daily' ? `$${employee.rate}/day` : `$${employee.rate}/hr`
  }

  const calculateDailyPay = (employee: Employee) => {
    if (employee.paymentType === 'daily') {
      return employee.rate
    } else {
      // For hourly employees, multiply rate by working hours
      return employee.rate * employee.workingHours
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {type === 'declared' ? 'Declared' : 'Undeclared'} Employees
        </h2>
        <EmployeeFormDialog mode="add" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              {type === 'declared' ? (
                <>
                  <TableHead>Contract Type</TableHead>
                  <TableHead>Start Date</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Working Since</TableHead>
                  <TableHead>Declaration Status</TableHead>
                </>
              )}
              <TableHead>Payment Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Today's Pay</TableHead>
              <TableHead>Benefits</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      {
                        'bg-green-100 text-green-800': employee.status === 'present',
                        'bg-red-100 text-red-800': employee.status === 'absent',
                        'bg-yellow-100 text-yellow-800': employee.status === 'late'
                      }
                    )}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                {type === 'declared' ? (
                  <>
                    <TableCell>Full Time</TableCell>
                    <TableCell>2023-01-15</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>2023-06-01</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      {
                        'bg-blue-100 text-blue-800': employee.paymentType === 'daily',
                        'bg-purple-100 text-purple-800': employee.paymentType === 'hourly'
                      }
                    )}
                  >
                    {employee.paymentType === 'daily' ? 'Daily Rate' : 'Hourly Rate'}
                  </span>
                </TableCell>
                <TableCell>{formatRate(employee)}</TableCell>
                <TableCell>
                  <span className="font-medium">${calculateDailyPay(employee).toFixed(2)}</span>
                  {employee.paymentType === 'hourly' && (
                    <span className="text-sm text-muted-foreground ml-1">
                      ({employee.workingHours} hrs)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Prime:</span>
                      <span className="text-sm">${employee.benefits.prime}</span>
                      <span className="text-xs text-muted-foreground">
                        ({employee.benefits.primeType})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Congés:</span>
                      <span className="text-sm">{employee.benefits.conges} jours</span>
                      <span className="text-xs text-muted-foreground">
                        (${employee.benefits.congesRate}/jour)
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="space-x-2">
                  <EmployeeFormDialog mode="edit" employee={employee} />
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
