import { useState } from 'react'

import { Employee, PaymentType } from '@/domain/entities/Employee'
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
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      type: 'declared',
      status: 'present',
      workingHours: 8.5,
      paymentType: 'daily',
      rate: 0
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
