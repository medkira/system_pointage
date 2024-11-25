import { Employee } from '@/domain/entities/Employee'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import { useExpenseStore } from '@/infrastructure/stores/expenseStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'

export function Overview() {
  const { employees } = useEmployeeStore()
  const { expenses } = useExpenseStore()

  const calculateDailyPay = (employee: Employee) => {
    if (employee.paymentType === 'daily') return employee.rate
    return employee.rate * employee.workingHours // hourly rate * hours
  }

  // Calculate today's payment
  const todayPayment = employees
    .filter((emp) => emp.status !== 'absent')
    .reduce((total, emp) => total + calculateDailyPay(emp), 0)

  // Calculate monthly projection
  const monthlyProjection = employees.reduce((total, emp) => {
    const dailyPay = calculateDailyPay(emp)
    return total + dailyPay * 22
  }, 0)

  // Calculate by employee type
  const declaredPayment = employees
    .filter((emp) => emp.type === 'declared' && emp.status !== 'absent')
    .reduce((total, emp) => total + calculateDailyPay(emp), 0)

  const undeclaredPayment = employees
    .filter((emp) => emp.type === 'undeclared' && emp.status !== 'absent')
    .reduce((total, emp) => total + calculateDailyPay(emp), 0)

  // Calculate total monthly fixed expenses
  const totalMonthlyExpenses = expenses.reduce((total, exp) => total + exp.monthlyAmount, 0)

  // Calculate daily expense portion
  const dailyExpenses = totalMonthlyExpenses / 30

  // Calculate total monthly business cost (expenses + projected salary)
  const totalMonthlyCost = monthlyProjection + totalMonthlyExpenses

  // Revenue calculations
  const dailyRevenue = 5000 // This should come from your revenue tracking
  const monthlyRevenue = dailyRevenue * 22 // Approximate monthly revenue

  // Profit/Loss Calculations
  const dailyProfit = dailyRevenue - (todayPayment + dailyExpenses)
  const monthlyProfit = monthlyRevenue - (monthlyProjection + totalMonthlyExpenses)

  // Profit margins
  const profitMargin = (monthlyProfit / monthlyRevenue) * 100

  return (
    <div className="space-y-4">
      {/* Revenue Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={dailyProfit >= 0 ? 'border-green-500' : 'border-red-500'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Profit/Loss</CardTitle>
            {dailyProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                {dailyProfit >= 0 ? '+' : '-'}${Math.abs(dailyProfit).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue: ${dailyRevenue} - Costs: ${(todayPayment + dailyExpenses).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className={monthlyProfit >= 0 ? 'border-green-500' : 'border-red-500'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Projection</CardTitle>
            {monthlyProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                {monthlyProfit >= 0 ? '+' : '-'}${Math.abs(monthlyProfit).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Expected profit margin: {profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dailyRevenue}</div>
            <p className="text-xs text-muted-foreground">Gross revenue before expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue}</div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div
                className={`h-2 rounded-full ${
                  profitMargin >= 20 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min(100, (profitMargin + 100) / 2)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {profitMargin >= 20 ? 'On Track' : 'Below Target'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Payments Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Total Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayPayment}</div>
            <p className="text-xs text-muted-foreground">
              For {employees.filter((emp) => emp.status !== 'absent').length} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyProjection}</div>
            <p className="text-xs text-muted-foreground">
              If all employees work full month (22 days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declared Employees Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${declaredPayment}</div>
            <p className="text-xs text-muted-foreground">Today's payment for declared employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Undeclared Employees Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${undeclaredPayment}</div>
            <p className="text-xs text-muted-foreground">
              Today's payment for undeclared employees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Business Expenses Section */}
      <h2 className="text-lg font-semibold mt-6 mb-4">Business Expenses</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Operating Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dailyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average daily portion of monthly expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Fixed Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyExpenses}</div>
            <p className="text-xs text-muted-foreground">Total monthly business expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyCost}</div>
            <p className="text-xs text-muted-foreground">Including salaries and expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const today = new Date()
              const nextDue = expenses
                .filter((exp) => exp.dueDay >= today.getDate())
                .sort((a, b) => a.dueDay - b.dueDay)[0]
              return nextDue ? (
                <>
                  <div className="text-2xl font-bold">${nextDue.monthlyAmount}</div>
                  <p className="text-xs text-muted-foreground">
                    {nextDue.name} due on {nextDue.dueDay}th
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">$0</div>
                  <p className="text-xs text-muted-foreground">No upcoming payments</p>
                </>
              )
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
