import { CalendarIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export function CalendarDateRangePicker(): JSX.Element {
  return (
    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
      <CalendarIcon className="mr-2 h-4 w-4" />
      <span>Pick a date</span>
    </Button>
  )
}
