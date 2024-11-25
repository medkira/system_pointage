import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDateRangePicker } from './components/date-range-picker'
import { MainNav } from './components/main-nav'
import { Overview } from './components/overview'
import { UserNav } from './components/user-nav'
import { AttendanceTable } from './components/attendance-table'
import { EmployeeTable } from './components/employee-table'

function App(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col overflow-auto">
      {/* Navigation */}
      <div className="border-b sticky top-0 bg-background z-10">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6 overflow-auto">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download Report</Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
    </div>
  )
}

export default App
