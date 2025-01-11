export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
  notes?: string
  createdAt: string
  lastInteraction?: string
}
