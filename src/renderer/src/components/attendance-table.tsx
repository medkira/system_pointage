import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Employee {
  id: string
  name: string
  position: string
  status: 'present' | 'absent' | 'late'
  checkIn?: string
  checkOut?: string
  workingHours: number
  type: 'declared' | 'undeclared'
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Software Engineer',
    status: 'present',
    checkIn: '09:00',
    checkOut: '17:30',
    workingHours: 8.5,
    type: 'declared'
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'UI Designer',
    status: 'late',
    checkIn: '09:45',
    checkOut: '18:15',
    workingHours: 8.5,
    type: 'undeclared'
  }
]

export function AttendanceTable(): JSX.Element {
  const [editingHours, setEditingHours] = useState<{ [key: string]: boolean }>({})

  const handleHoursUpdate = (employeeId: string, hours: string) => {
    const numHours = parseFloat(hours)
    if (!isNaN(numHours) && numHours >= 0 && numHours <= 24) {
      console.log(`Updated ${employeeId} hours to ${numHours}`)
      // Here you would update your data store
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Today's Attendance</h3>
          <p className="text-sm text-muted-foreground">Standard working hours: 8.5</p>
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Working Hours</TableHead>
            <TableHead>Present</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
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
                  {employee.type}
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
                  {employee.status}
                </span>
              </TableCell>
              <TableCell>{employee.checkIn || '-'}</TableCell>
              <TableCell>{employee.checkOut || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {editingHours[employee.id] ? (
                    <Input
                      type="number"
                      defaultValue={employee.workingHours}
                      className="w-20"
                      step="0.5"
                      min="0"
                      max="24"
                      onBlur={(e) => {
                        handleHoursUpdate(employee.id, e.target.value)
                        setEditingHours((prev) => ({ ...prev, [employee.id]: false }))
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleHoursUpdate(employee.id, (e.target as HTMLInputElement).value)
                          setEditingHours((prev) => ({ ...prev, [employee.id]: false }))
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                      onClick={() => setEditingHours((prev) => ({ ...prev, [employee.id]: true }))}
                    >
                      <span
                        className={cn('font-medium', {
                          'text-green-600': employee.workingHours >= 8.5,
                          'text-yellow-600':
                            employee.workingHours >= 7 && employee.workingHours < 8.5,
                          'text-red-600': employee.workingHours < 7
                        })}
                      >
                        {employee.workingHours}
                      </span>
                      <span className="text-muted-foreground">/8.5</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={employee.status === 'present'}
                  onCheckedChange={(checked) => {
                    console.log(`${employee.name} attendance: ${checked}`)
                    // Here you would update your data store
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
