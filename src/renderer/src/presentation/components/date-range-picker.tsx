import { CalendarIcon } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Calendar } from '@/presentation/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover'
import { cn } from '@/presentation/lib/utils'
import { format } from 'date-fns'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'

export function CalendarDateRangePicker() {
  const { selectedDate, setSelectedDate } = useEmployeeStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(new Date(selectedDate), 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={new Date(selectedDate)}
          onSelect={(date) => date && setSelectedDate(date.toISOString().split('T')[0])}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
