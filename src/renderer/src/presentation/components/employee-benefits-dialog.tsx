import { useState } from 'react'
import { Employee } from '@/domain/entities/Employee'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/presentation/components/ui/select'
import { format } from 'date-fns'
import { Gift, Badge } from 'lucide-react'

interface EmployeeBenefitsDialogProps {
  employee: Employee
}

export function EmployeeBenefitsDialog({ employee }: EmployeeBenefitsDialogProps) {
  const [open, setOpen] = useState(false)
  const { updateEmployee } = useEmployeeStore()

  const handleBenefitUpdate = (type: 'prime' | 'conges', value: number) => {
    updateEmployee({
      ...employee,
      benefits: {
        ...employee.benefits,
        [type]: value,
        [`last${type.charAt(0).toUpperCase() + type.slice(1)}Date`]: new Date().toISOString()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 w-full px-2 py-1.5 hover:bg-muted cursor-pointer">
          <Gift className="h-4 w-4" />
          <span>Manage Benefits</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Benefits - {employee.name}</span>
            <Badge variant={employee.type === 'declared' ? 'default' : 'secondary'}>
              {employee.type}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Manage employee's prime and congés for {format(new Date(), 'MMMM yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prime Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Prime</Label>
              <div className="text-sm text-muted-foreground">
                Last:{' '}
                {employee.benefits.lastPrimeDate
                  ? format(new Date(employee.benefits.lastPrimeDate), 'PP')
                  : 'Never'}
              </div>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={employee.benefits.prime || ''}
                onChange={(e) => handleBenefitUpdate('prime', parseFloat(e.target.value))}
                className="w-32"
                placeholder="Amount"
              />
              <Select
                value={employee.benefits.primeType}
                onValueChange={(value: any) =>
                  updateEmployee({
                    ...employee,
                    benefits: { ...employee.benefits, primeType: value }
                  })
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

          {/* Congés Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Congés</Label>
              <div className="text-sm text-muted-foreground">
                Last:{' '}
                {employee.benefits.lastCongesDate
                  ? format(new Date(employee.benefits.lastCongesDate), 'PP')
                  : 'Never'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Days</Label>
                <Input
                  type="number"
                  value={employee.benefits.conges || ''}
                  onChange={(e) => handleBenefitUpdate('conges', parseFloat(e.target.value))}
                  placeholder="Days"
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Rate</Label>
                <Input
                  type="number"
                  value={employee.benefits.congesRate || ''}
                  onChange={(e) =>
                    updateEmployee({
                      ...employee,
                      benefits: { ...employee.benefits, congesRate: parseFloat(e.target.value) }
                    })
                  }
                  placeholder="Rate"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Total Benefits Value:</span>
              <span className="font-medium">
                €
                {(
                  employee.benefits.prime +
                  employee.benefits.conges * employee.benefits.congesRate
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
