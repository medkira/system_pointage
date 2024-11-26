import { useState } from 'react'
import { Employee } from '@/domain/entities/Employee'
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
import { Input } from '@/presentation/components/ui/input'

interface EmployeeBenefitsDialogProps {
  employee: Employee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeBenefitsDialog({
  employee,
  open,
  onOpenChange
}: EmployeeBenefitsDialogProps) {
  const { updateEmployee } = useEmployeeStore()
  const [approvePrime, setApprovePrime] = useState(false)
  const [approveCongee, setApproveCongee] = useState(false)

  // Calculate prime based on performance and attendance
  const calculatedPrime = () => {
    const baseRate = employee.paymentType === 'daily' ? employee.rate : employee.rate * 8
    const monthlyBase = baseRate * 22 // 22 working days per month

    // Performance bonus (based on working hours)
    const performanceMultiplier = employee.workingHours >= 8.5 ? 0.15 : 0.1
    const performanceBonus = monthlyBase * performanceMultiplier

    // Attendance bonus
    const attendanceBonus = employee.status === 'present' ? 200 : 0

    return {
      base: monthlyBase * 0.1, // Base prime is 10% of monthly salary
      performance: performanceBonus,
      attendance: attendanceBonus,
      total: monthlyBase * 0.1 + performanceBonus + attendanceBonus
    }
  }

  // Calculate congee based on employee status and tenure
  const calculatedCongee = () => {
    const baseRate = employee.paymentType === 'daily' ? employee.rate : employee.rate * 8

    // Base congee days (standard 30 days per year)
    const baseDays = 30

    // Additional days based on attendance
    const attendanceBonus = employee.status === 'present' ? 2 : 0

    // Calculate daily rate during congee (usually 100% of base rate)
    const dailyRate = baseRate

    return {
      baseDays,
      attendanceBonus,
      totalDays: baseDays + attendanceBonus,
      dailyRate
    }
  }

  const handleSave = () => {
    const congeeDetails = calculatedCongee()

    updateEmployee({
      ...employee,
      benefits: {
        ...employee.benefits,
        prime: approvePrime ? calculatedPrime().total : 0,
        primeType: 'performance',
        lastPrimeDate: approvePrime ? new Date().toISOString() : employee.benefits.lastPrimeDate,
        conges: approveCongee ? congeeDetails.totalDays : 0,
        congesRate: approveCongee ? congeeDetails.dailyRate : 0,
        lastCongesDate: approveCongee ? new Date().toISOString() : employee.benefits.lastCongesDate
      }
    })
    onOpenChange(false)
  }

  const primeDetails = calculatedPrime()
  const congeeDetails = calculatedCongee()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Monthly Benefits - {employee.name}</span>
            <Badge variant={employee.type === 'declared' ? 'default' : 'secondary'}>
              {employee.type}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            End of month benefits for {format(new Date(), 'MMMM yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prime Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Prime Calculation</Label>
                <p className="text-sm text-muted-foreground">Based on performance and attendance</p>
              </div>
              <Switch checked={approvePrime} onCheckedChange={setApprovePrime} />
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Prime (10%):</span>
                <span>€{primeDetails.base.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Performance Bonus:</span>
                <span>€{primeDetails.performance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Attendance Bonus:</span>
                <span>€{primeDetails.attendance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Prime:</span>
                <span className="text-green-600">€{primeDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Congé Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Congé Management</Label>
                <p className="text-sm text-muted-foreground">Based on attendance and tenure</p>
              </div>
              <Switch checked={approveCongee} onCheckedChange={setApproveCongee} />
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Days:</span>
                <span>{congeeDetails.baseDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Attendance Bonus:</span>
                <span>+{congeeDetails.attendanceBonus} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Daily Rate During Congé:</span>
                <span>€{congeeDetails.dailyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Leave Days:</span>
                <span className="text-blue-600">{congeeDetails.totalDays} days</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              Last congé update:{' '}
              {employee.benefits.lastCongesDate
                ? format(new Date(employee.benefits.lastCongesDate), 'PP')
                : 'Never'}
            </div>
          </div>

          {/* Last Benefits Info */}
          <div className="text-sm text-muted-foreground">
            Last prime given:{' '}
            {employee.benefits.lastPrimeDate
              ? format(new Date(employee.benefits.lastPrimeDate), 'PP')
              : 'Never'}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
