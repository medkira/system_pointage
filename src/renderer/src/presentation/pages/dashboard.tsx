import { Button } from '@/presentation/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { CalendarDateRangePicker } from '../components/date-range-picker'
import { Overview } from '../components/overview'
import { AttendanceTable } from '../components/attendance-table'
import { EmployeeTable } from '../components/employee-table'

export function Dashboard(): JSX.Element {
  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="all-employees">All Employees</TabsTrigger>
          <TabsTrigger value="declared-employees">Declared Employees</TabsTrigger>
          <TabsTrigger value="undeclared-employees">Undeclared Employees</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTable />
        </TabsContent>
        <TabsContent value="all-employees" className="space-y-4">
          <EmployeeTable type="all" />
        </TabsContent>
        <TabsContent value="declared-employees" className="space-y-4">
          <EmployeeTable type="declared" />
        </TabsContent>
        <TabsContent value="undeclared-employees" className="space-y-4">
          <EmployeeTable type="undeclared" />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          {/* Reports content will be implemented later */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
