import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/presentation/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/presentation/components/ui/table'
import { Input } from '@/presentation/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/presentation/components/ui/select'
import { Label } from '@/presentation/components/ui/label'
import { Separator } from '@/presentation/components/ui/separator'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { Calendar } from '@/presentation/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover'
import type { BusinessExpense } from '@/domain/entities/BusinessExpense'

const expenseCategories = {
  rent: {
    label: 'expenses.categories.rent',
    subcategories: {
      office: 'expenses.subcategories.rent.office',
      warehouse: 'expenses.subcategories.rent.warehouse',
      parking: 'expenses.subcategories.rent.parking'
    }
  },
  utilities: {
    label: 'expenses.categories.utilities',
    subcategories: {
      electricity: 'expenses.subcategories.utilities.electricity',
      water: 'expenses.subcategories.utilities.water',
      gas: 'expenses.subcategories.utilities.gas',
      internet: 'expenses.subcategories.utilities.internet'
    }
  },
  vehicles: {
    label: 'expenses.categories.vehicles',
    subcategories: {
      rental: 'expenses.subcategories.vehicles.rental',
      fuel: 'expenses.subcategories.vehicles.fuel',
      maintenance: 'expenses.subcategories.vehicles.maintenance',
      insurance: 'expenses.subcategories.vehicles.insurance'
    }
  },
  depreciation: {
    label: 'expenses.categories.depreciation',
    subcategories: {
      global: 'expenses.subcategories.depreciation.global',
      vehicles: 'expenses.subcategories.depreciation.vehicles',
      equipment: 'expenses.subcategories.depreciation.equipment',
      buildings: 'expenses.subcategories.depreciation.buildings',
      software: 'expenses.subcategories.depreciation.software'
    }
  },
  other: {
    label: 'expenses.categories.other',
    subcategories: {
      supplies: 'expenses.subcategories.other.supplies',
      maintenance: 'expenses.subcategories.other.maintenance',
      insurance: 'expenses.subcategories.other.insurance'
    }
  }
} as const

export function ExpensesPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<BusinessExpense>({
    id: '',
    type: 'rent',
    subtype: 'office',
    name: '',
    monthlyAmount: 0,
    dueDay: 1,
    recurring: true
  })
  const [expenses, setExpenses] = useState<BusinessExpense[]>([])
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof expenseCategories>('rent')
  const [date, setDate] = useState<Date>()

  const handleSave = () => {
    if (formData.monthlyAmount > 0 && formData.dueDay >= 1 && formData.dueDay <= 31) {
      const newExpense = {
        ...formData,
        id: formData.id || Math.random().toString(36).slice(2),
        dueDay: date ? date.getDate() : 1
      }

      if (formData.id) {
        setExpenses(expenses.map((e) => (e.id === formData.id ? newExpense : e)))
      } else {
        setExpenses([...expenses, newExpense])
      }

      // Reset form
      setFormData({
        id: '',
        type: 'rent',
        subtype: 'office',
        name: '',
        monthlyAmount: 0,
        dueDay: 1,
        recurring: true
      })
      setDate(undefined)
    }
  }

  const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.monthlyAmount, 0)

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('expenses.title')}</h2>
          <p className="text-muted-foreground">{t('expenses.subtitle')}</p>
        </div>
        <Card className="p-4">
          <CardTitle className="text-2xl font-bold">€{totalMonthlyExpenses.toFixed(2)}</CardTitle>
          <CardDescription>{t('expenses.totalMonthly')}</CardDescription>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('expenses.form.addExpense')}</CardTitle>
            <CardDescription>{t('expenses.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('expenses.form.category')}</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value: keyof typeof expenseCategories) => {
                    setSelectedCategory(value)
                    setFormData({
                      ...formData,
                      type: value,
                      subtype: Object.keys(expenseCategories[value].subcategories)[0]
                    })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(expenseCategories).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {t(value.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('expenses.form.subcategory')}</Label>
                <Select
                  value={formData.subtype}
                  onValueChange={(value) => setFormData({ ...formData, subtype: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(expenseCategories[selectedCategory].subcategories).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {t(value)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('expenses.form.monthlyAmount')}</Label>
                <Input
                  type="number"
                  value={formData.monthlyAmount || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyAmount: Number(e.target.value) })
                  }
                  placeholder="0.00"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('expenses.form.dueDay')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : t('expenses.form.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleSave}
                className="w-full"
                disabled={!formData.monthlyAmount || !date}
              >
                {formData.id ? t('common.save') : t('expenses.form.addExpense')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('expenses.list.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('expenses.form.category')}</TableHead>
                    <TableHead>{t('expenses.form.subcategory')}</TableHead>
                    <TableHead className="text-right">{t('expenses.form.monthlyAmount')}</TableHead>
                    <TableHead className="text-right">{t('expenses.form.dueDay')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{t(expenseCategories[expense.type].label)}</TableCell>
                      <TableCell>
                        {t(expenseCategories[expense.type].subcategories[expense.subtype])}
                      </TableCell>
                      <TableCell className="text-right">
                        €{expense.monthlyAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{expense.dueDay}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setFormData(expense)
                            setDate(new Date(2024, 0, expense.dueDay))
                          }}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setExpenses(expenses.filter((e) => e.id !== expense.id))}
                        >
                          {t('common.delete')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
