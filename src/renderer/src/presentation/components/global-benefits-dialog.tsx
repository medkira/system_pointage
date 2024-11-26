import { useState } from 'react'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Label } from '@/presentation/components/ui/label'
import { Switch } from '@/presentation/components/ui/switch'
import { Badge } from '@/presentation/components/ui/badge'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/presentation/components/ui/select'
import { PrimeType } from '@/domain/entities/Employee'
import { AlertCircle, Gift, Calendar, Users } from 'lucide-react'
import { cn } from '@/presentation/lib/utils'

interface GlobalBenefitsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeType: 'declared' | 'undeclared'
}

export function GlobalBenefitsDialog({
  open,
  onOpenChange,
  employeeType
}: GlobalBenefitsDialogProps) {
  const { employees, updateEmployee } = useEmployeeStore()
  const [selectedBenefit, setSelectedBenefit] = useState<'prime' | 'conge'>('prime')
  const [action, setAction] = useState<'give' | 'remove'>('give')
  const [isConfirming, setIsConfirming] = useState(false)

  // Filter employees based on type
  const filteredEmployees = employees.filter((emp) => emp.type === employeeType)

  // Calculate benefits for an employee
  const calculateBenefits = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (!employee) return null

    const baseRate = employee.paymentType === 'daily' ? employee.rate : employee.rate * 8
    const monthlyBase = baseRate * 22

    if (selectedBenefit === 'prime') {
      const performanceMultiplier = employee.workingHours >= 8.5 ? 0.15 : 0.1
      const performanceBonus = monthlyBase * performanceMultiplier
      const attendanceBonus = employee.status === 'present' ? 200 : 0
      return {
        prime: monthlyBase * 0.1 + performanceBonus + attendanceBonus,
        primeType: 'performance' as const
      }
    } else {
      const baseDays = 30
      const attendanceBonus = employee.status === 'present' ? 2 : 0
      return {
        conges: baseDays + attendanceBonus,
        congesRate: baseRate
      }
    }
  }

  const handleApply = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }

    const currentDate = new Date().toISOString()

    // Only update filtered employees
    filteredEmployees.forEach((employee) => {
      const benefits = calculateBenefits(employee.id)
      if (!benefits) return

      if (selectedBenefit === 'prime') {
        updateEmployee({
          ...employee,
          benefits: {
            ...employee.benefits,
            prime: action === 'give' ? (benefits.prime as number) : 0,
            primeType: benefits.primeType as PrimeType,
            lastPrimeDate: action === 'give' ? currentDate : employee.benefits.lastPrimeDate
          }
        })
      } else {
        updateEmployee({
          ...employee,
          benefits: {
            ...employee.benefits,
            conges: action === 'give' ? (benefits.conges as number) : 0,
            congesRate: action === 'give' ? (benefits.congesRate as number) : 0,
            lastCongesDate: action === 'give' ? currentDate : employee.benefits.lastCongesDate
          }
        })
      }
    })

    onOpenChange(false)
  }

  const handleClose = () => {
    setIsConfirming(false)
    onOpenChange(false)
  }

  const getBenefitIcon = () => {
    return selectedBenefit === 'prime' ? (
      <Gift className="w-4 h-4" />
    ) : (
      <Calendar className="w-4 h-4" />
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBenefitIcon()}
            <span>
              Global Benefits - {employeeType.charAt(0).toUpperCase() + employeeType.slice(1)}{' '}
              Employees
            </span>
          </DialogTitle>
          <DialogDescription>
            Apply or remove benefits for all {employeeType} employees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Benefit Type */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                1
              </div>
              Select Benefit Type
            </div>
            <Select
              value={selectedBenefit}
              onValueChange={(value: 'prime' | 'conge') => {
                setSelectedBenefit(value)
                setIsConfirming(false)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select benefit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prime" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Prime (Performance Bonus)
                </SelectItem>
                <SelectItem value="conge" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Congé (Leave Days)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Select Action */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                2
              </div>
              Select Action
            </div>
            <Select
              value={action}
              onValueChange={(value: 'give' | 'remove') => {
                setAction(value)
                setIsConfirming(false)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="give" className="text-green-600">
                  Give Benefit
                </SelectItem>
                <SelectItem value="remove" className="text-red-600">
                  Remove Benefit
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Card */}
          <div
            className={cn(
              'p-4 rounded-lg border transition-colors',
              isConfirming ? 'border-primary bg-primary/5' : 'border-border'
            )}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={cn(
                    'w-5 h-5 mt-0.5',
                    isConfirming ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div className="space-y-1">
                  <h4 className="font-medium leading-none">Review Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    This will {action === 'give' ? 'grant' : 'remove'}{' '}
                    {selectedBenefit === 'prime' ? 'performance bonus' : 'leave days'} for all{' '}
                    {employeeType} employees.
                    {action === 'give' && (
                      <>
                        {selectedBenefit === 'prime'
                          ? " The amount will be calculated based on each employee's performance and attendance."
                          : ' Days will be calculated based on attendance and tenure.'}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Affected employees: {filteredEmployees.length}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            variant={action === 'remove' ? 'destructive' : 'default'}
            className={cn('gap-2', isConfirming && 'animate-pulse')}
          >
            {isConfirming ? (
              <>
                {action === 'give' ? 'Confirm Apply' : 'Confirm Remove'}
                {getBenefitIcon()}
              </>
            ) : (
              <>
                {action === 'give' ? 'Apply Benefits' : 'Remove Benefits'}
                {getBenefitIcon()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
