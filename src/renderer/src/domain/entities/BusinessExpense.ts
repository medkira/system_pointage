export interface BusinessExpense {
  id: string
  type: 'rent' | 'utility' | 'vehicle' | 'other'
  name: string
  monthlyAmount: number
  dueDay: number
}
