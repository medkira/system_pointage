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
import { EmployeeBenefitsDialog } from './employee-benefits-dialog'
import { MoreHorizontal, Gift, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/presentation/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/presentation/components/ui/dialog'
import { Badge } from '@/presentation/components/ui/badge'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/presentation/components/ui/select'
import { format } from 'date-fns'

interface EmployeeTableProps {
  type: 'declared' | 'undeclared'
}

export function EmployeeTable({ type }: EmployeeTableProps) {
  const { employees } = useEmployeeStore()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
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
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn('h-2 w-2 rounded-full', {
                        'bg-green-500': employee.benefits.prime > 0 || employee.benefits.conges > 0,
                        'bg-gray-300':
                          employee.benefits.prime === 0 && employee.benefits.conges === 0
                      })}
                    />
                    <div className="space-y-1">
                      {employee.benefits.prime > 0 && (
                        <div className="flex items-center space-x-2">
                          <Gift className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">€{employee.benefits.prime}</span>
                        </div>
                      )}
                      {employee.benefits.conges > 0 && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{employee.benefits.conges} jours</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <EmployeeFormDialog mode="edit" employee={employee} />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EmployeeBenefitsDialog employee={employee} />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Remove Employee</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Monthly Benefits - {selectedEmployee.name}</span>
                  <Badge variant="outline">{format(new Date(), 'MMMM yyyy')}</Badge>
                </DialogTitle>
                <DialogDescription>
                  Manage end of month benefits for this employee
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Prime</Label>
                    <div className="text-sm text-muted-foreground">
                      Last:{' '}
                      {selectedEmployee.benefits.lastPrimeDate
                        ? format(new Date(selectedEmployee.benefits.lastPrimeDate), 'PP')
                        : 'Never'}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={selectedEmployee.benefits.prime || ''}
                      onChange={(e) =>
                        handleBenefitUpdate(selectedEmployee, 'prime', parseFloat(e.target.value))
                      }
                      className="w-32"
                      placeholder="Amount"
                    />
                    <Select
                      value={selectedEmployee.benefits.primeType}
                      onValueChange={(value: any) =>
                        handleBenefitUpdate(selectedEmployee, 'primeType', value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="attendance">Présence</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Congés</Label>
                    <div className="text-sm text-muted-foreground">
                      Last:{' '}
                      {selectedEmployee.benefits.lastCongesDate
                        ? format(new Date(selectedEmployee.benefits.lastCongesDate), 'PP')
                        : 'Never'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Days</Label>
                      <Input
                        type="number"
                        value={selectedEmployee.benefits.conges || ''}
                        onChange={(e) =>
                          handleBenefitUpdate(
                            selectedEmployee,
                            'conges',
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Days"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Daily Rate</Label>
                      <Input
                        type="number"
                        value={selectedEmployee.benefits.congesRate || ''}
                        onChange={(e) =>
                          handleBenefitUpdate(
                            selectedEmployee,
                            'congesRate',
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Rate"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                  Close
                </Button>
                <Button onClick={() => setSelectedEmployee(null)}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
