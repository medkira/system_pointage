import { BusinessExpense } from '../entities/BusinessExpense'

export interface IExpenseRepository {
  getExpenses(): Promise<BusinessExpense[]>
  addExpense(expense: BusinessExpense): Promise<void>
  updateExpense(expense: BusinessExpense): Promise<void>
}
