import { create } from 'zustand'
import { BusinessExpense } from '@/domain/entities/BusinessExpense'

interface ExpenseState {
  expenses: BusinessExpense[]
  isLoading: boolean
  error: string | null
  setExpenses: (expenses: BusinessExpense[]) => void
  addExpense: (expense: BusinessExpense) => void
  updateExpense: (expense: BusinessExpense) => void
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,
  error: null,
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (newExpense) =>
    set((state) => ({
      expenses: [...state.expenses, newExpense]
    })),
  updateExpense: (updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
    }))
}))
