export interface BusinessExpense {
  id: string
  type: 'rent' | 'utilities' | 'vehicles' | 'depreciation' | 'other'
  subtype: string
  name: string
  monthlyAmount: number
  dueDay: number
  recurring: boolean
}
