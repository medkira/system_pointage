import { useState, useEffect } from 'react'

import { Employee, PaymentType, PrimeType } from '@/domain/entities/Employee'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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
import { cn } from '../lib/utils'

interface EmployeeFormDialogProps {
  mode: 'add' | 'edit'
  employee?: Employee
  onClose?: () => void
}

export function EmployeeFormDialog({ mode, employee, onClose }: EmployeeFormDialogProps) {
  const [open, setOpen] = useState(false)
  const { addEmployee, updateEmployee } = useEmployeeStore()
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      id: `EMP${Math.floor(Math.random() * 10000)}`,
      type: 'declared',
      status: 'present',
      workingHours: 8.5,
      paymentType: 'daily',
      rate: 0,
      benefits: {
        prime: 0,
        conges: 0,
        congesRate: 0,
        primeType: 'performance'
      }
    }
  )

  useEffect(() => {
    if (!open && !employee) {
      setFormData({
        id: `EMP${Math.floor(Math.random() * 10000)}`,
        type: 'declared',
        status: 'present',
        workingHours: 8.5,
        paymentType: 'daily',
        rate: 0,
        benefits: {
          prime: 0,
          conges: 0,
          congesRate: 0,
          primeType: 'performance'
        }
      })
    }
  }, [open, employee])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'add') {
      addEmployee(formData as Employee)
    } else {
      updateEmployee(formData as Employee)
    }
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button
          variant={mode === 'add' ? 'default' : 'outline'}
          className={cn({
            'w-full justify-start': mode === 'edit'
          })}
        >
          {mode === 'add' ? '+ Add Employee' : 'Edit Details'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Employee' : 'Edit Employee'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new employee to your organization.'
              : 'Update employee information.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Software Engineer"
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Employee Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Employee['type']) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="declared">Declared</SelectItem>
                  <SelectItem value="undeclared">Undeclared</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                value={formData.paymentType}
                onValueChange={(value: PaymentType) =>
                  setFormData({ ...formData, paymentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Rate</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">
              {formData.paymentType === 'daily' ? 'Daily Rate ($)' : 'Hourly Rate ($)'}
            </Label>
            <Input
              id="rate"
              type="number"
              min="0"
              step="0.01"
              placeholder={formData.paymentType === 'daily' ? '150.00' : '15.00'}
              value={formData.rate || ''}
              onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
              required
            />
            <p className="text-sm text-muted-foreground">
              {formData.paymentType === 'daily'
                ? 'Enter the daily rate for this employee'
                : 'Enter the hourly rate for this employee'}
            </p>
          </div>

          {formData.type === 'declared' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-medium">Avantages</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prime">Prime (€)</Label>
                <Input
                  id="prime"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.benefits?.prime || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits!, prime: parseFloat(e.target.value) }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primeType">Type de Prime</Label>
                <Select
                  value={formData.benefits?.primeType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits!, primeType: value as PrimeType }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="attendance">Présence</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conges">Congés (Jours)</Label>
                <Input
                  id="conges"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.benefits?.conges || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits!, conges: parseInt(e.target.value) }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="congesRate">Taux Congés (€)</Label>
                <Input
                  id="congesRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.benefits?.congesRate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits!, congesRate: parseFloat(e.target.value) }
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
