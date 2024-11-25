import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import { useExpenseStore } from '@/infrastructure/stores/expenseStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'

export function Overview() {
  const { employees } = useEmployeeStore()
  const { expenses } = useExpenseStore()

  // Calculate today's payment
  const todayPayment = employees
    .filter((emp) => emp.status !== 'absent')
    .reduce((total, emp) => total + emp.dailyRate, 0)

  // Calculate potential monthly payment (assuming 22 working days)
  const monthlyProjection = employees.reduce((total, emp) => total + emp.dailyRate * 22, 0)

  // Calculate by employee type
  const declaredPayment = employees
    .filter((emp) => emp.type === 'declared' && emp.status !== 'absent')
    .reduce((total, emp) => total + emp.dailyRate, 0)

  const undeclaredPayment = employees
    .filter((emp) => emp.type === 'undeclared' && emp.status !== 'absent')
    .reduce((total, emp) => total + emp.dailyRate, 0)

  // Calculate total monthly fixed expenses
  const totalMonthlyExpenses = expenses.reduce((total, exp) => total + exp.monthlyAmount, 0)

  // Calculate daily expense portion
  const dailyExpenses = totalMonthlyExpenses / 30

  // Calculate total monthly business cost (expenses + projected salary)
  const totalMonthlyCost = monthlyProjection + totalMonthlyExpenses

  return (
    <div className="space-y-4">
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
