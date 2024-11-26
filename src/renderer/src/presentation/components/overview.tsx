import { Employee } from '@/domain/entities/Employee'
import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
import { useExpenseStore } from '@/infrastructure/stores/expenseStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'

export function Overview() {
  const { t } = useTranslation()
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

  const activeEmployees = employees.filter((emp) => emp.status !== 'absent').length

  // Data for pie charts
  const employeeDistribution = [
    {
      name: t('employees.type.declared'),
      value: employees.filter((emp) => emp.type === 'declared').length
    },
    {
      name: t('employees.type.undeclared'),
      value: employees.filter((emp) => emp.type === 'undeclared').length
    }
  ]

  const paymentDistribution = [
    { name: t('employees.type.declared'), value: declaredPayment },
    { name: t('employees.type.undeclared'), value: undeclaredPayment }
  ]

  const COLORS = ['#0088FE', '#FF8042']

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('overview.cards.todayPayment.title')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{todayPayment.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {t('overview.cards.todayPayment.subtitle', { count: activeEmployees })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('overview.cards.monthlyProjection.title')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{monthlyProjection.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {t('overview.cards.monthlyProjection.subtitle')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('overview.cards.declaredPayment.title')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{declaredPayment.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {t('overview.cards.declaredPayment.subtitle')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('overview.cards.undeclaredPayment.title')}
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{undeclaredPayment.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {t('overview.cards.undeclaredPayment.subtitle')}
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{t('overview.charts.employeeDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={employeeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {employeeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{t('overview.charts.paymentDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('overview.cards.expenses.title')}
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalMonthlyExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{t('overview.cards.expenses.subtitle')}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {t('overview.cards.expenses.daily')}: €{dailyExpenses.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
