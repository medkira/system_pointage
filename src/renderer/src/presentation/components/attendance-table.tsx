import { useState } from 'react'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import { Calendar } from '@/presentation/components/ui/calendar'
import { Button } from '@/presentation/components/ui/button'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/presentation/components/ui/table'
import { Switch } from '@/presentation/components/ui/switch'
import { Input } from '@/presentation/components/ui/input'
import { cn } from '@/presentation/lib/utils'

export function AttendanceTable(): JSX.Element {
  const { employees, selectedDate, attendanceRecords, updateAttendanceForDate } = useEmployeeStore()
  const [editingHours, setEditingHours] = useState<{ [key: string]: boolean }>({})

  const getAttendanceForDate = (employeeId: string) => {
    return attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === selectedDate
    )
  }

  const handleHoursUpdate = (employeeId: string, hours: string) => {
    const numHours = parseFloat(hours)
    if (!isNaN(numHours) && numHours >= 0 && numHours <= 24) {
      updateAttendanceForDate(employeeId, selectedDate, 'present', {
        workingHours: numHours
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">
            Attendance for {format(new Date(selectedDate), 'PPP')}
          </h3>
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
          {employees.map((employee) => {
            const attendanceRecord = getAttendanceForDate(employee.id)
            return (
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
                        'bg-green-100 text-green-800': attendanceRecord?.status === 'present',
                        'bg-red-100 text-red-800': attendanceRecord?.status === 'absent',
                        'bg-yellow-100 text-yellow-800': attendanceRecord?.status === 'late'
                      }
                    )}
                  >
                    {attendanceRecord?.status}
                  </span>
                </TableCell>
                <TableCell>{attendanceRecord?.checkIn || '-'}</TableCell>
                <TableCell>{attendanceRecord?.checkOut || '-'}</TableCell>
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
                        onClick={() =>
                          setEditingHours((prev) => ({ ...prev, [employee.id]: true }))
                        }
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
                    checked={attendanceRecord?.status === 'present'}
                    onCheckedChange={(checked) => {
                      updateAttendanceForDate(
                        employee.id,
                        selectedDate,
                        checked ? 'present' : 'absent',
                        {
                          checkIn: checked ? format(new Date(), 'HH:mm') : undefined,
                          workingHours: employee.workingHours
                        }
                      )
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
