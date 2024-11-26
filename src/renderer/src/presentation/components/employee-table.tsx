import { useState } from 'react'
import { Employee } from '@/domain/entities/Employee'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
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
import { EmployeeBenefitsDialog } from './employee-benefits-dialog'
import { cn } from '../lib/utils'

interface EmployeeTableProps {
  type: 'declared' | 'undeclared'
}

export function EmployeeTable({ type }: EmployeeTableProps) {
  const { employees } = useEmployeeStore()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const filteredEmployees = employees.filter((emp) => emp.type === type)

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
              <TableHead>Payment Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Prime Status</TableHead>
              <TableHead>Congé Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow
                key={employee.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedEmployee(employee)}
              >
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
                <TableCell>€{employee.rate}</TableCell>
                <TableCell>
                  {employee.benefits.prime > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Prime Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No Prime
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {employee.benefits.conges > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.benefits.conges} Days Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No Congé Days
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEmployee(employee)
                    }}
                  >
                    Manage Benefits
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedEmployee && (
        <EmployeeBenefitsDialog
          employee={selectedEmployee}
          open={!!selectedEmployee}
          onOpenChange={(open) => !open && setSelectedEmployee(null)}
        />
      )}
    </div>
  )
}
