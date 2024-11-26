import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { GlobalBenefitsDialog } from './global-benefits-dialog'
import { cn } from '../lib/utils'

interface EmployeeTableProps {
  type: 'declared' | 'undeclared' | 'all'
}

export function EmployeeTable({ type }: EmployeeTableProps) {
  const { t } = useTranslation()
  const { employees } = useEmployeeStore()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showGlobalBenefits, setShowGlobalBenefits] = useState(false)
  const filteredEmployees =
    type === 'all' ? employees : employees.filter((emp) => emp.type === type)

  const getTableTitle = () => {
    switch (type) {
      case 'all':
        return t('dashboard.allEmployees')
      case 'declared':
        return t('dashboard.declaredEmployees')
      case 'undeclared':
        return t('dashboard.undeclaredEmployees')
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">{getTableTitle()}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGlobalBenefits(true)}>
            {t('employees.benefits.manage')}
          </Button>
          <EmployeeFormDialog mode="add" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t('common.name')}</TableHead>
              <TableHead>{t('common.position')}</TableHead>
              <TableHead>{t('common.type')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead>{t('employees.paymentType.daily')}</TableHead>
              <TableHead>{t('common.rate')}</TableHead>
              <TableHead>{t('employees.benefits.prime.title')}</TableHead>
              <TableHead>{t('employees.benefits.conge.title')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
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
                        'bg-blue-100 text-blue-800': employee.type === 'declared',
                        'bg-orange-100 text-orange-800': employee.type === 'undeclared'
                      }
                    )}
                  >
                    {t(`employees.type.${employee.type}`)}
                  </span>
                </TableCell>
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
                    {t(`employees.status.${employee.status}`)}
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
                    {t(`employees.paymentType.${employee.paymentType}`)}
                  </span>
                </TableCell>
                <TableCell>€{employee.rate}</TableCell>
                <TableCell>
                  {employee.benefits.prime > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t('employees.benefits.prime.approved')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {t('employees.benefits.prime.none')}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {employee.benefits.conges > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {t('employees.benefits.conge.available', { days: employee.benefits.conges })}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {t('employees.benefits.conge.none')}
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
                    {t('employees.benefits.manage')}
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

      <GlobalBenefitsDialog
        open={showGlobalBenefits}
        onOpenChange={setShowGlobalBenefits}
        employeeType={type}
      />
    </div>
  )
}
