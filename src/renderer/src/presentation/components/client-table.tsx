import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Client } from '@/domain/entities/Client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/presentation/components/ui/table'
import { Button } from '@/presentation/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/presentation/lib/utils'

// Temporary mock data - replace with actual store later
const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    phone: '+1234567890',
    address: '123 Main St',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString()
  }
]

export function ClientTable() {
  const { t } = useTranslation()
  const [clients] = useState<Client[]>(mockClients)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">{t('clients.title')}</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('clients.addClient')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.name')}</TableHead>
              <TableHead>{t('clients.company')}</TableHead>
              <TableHead>{t('clients.email')}</TableHead>
              <TableHead>{t('clients.phone')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead>{t('clients.lastInteraction')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      {
                        'bg-green-100 text-green-800': client.status === 'active',
                        'bg-gray-100 text-gray-800': client.status === 'inactive'
                      }
                    )}
                  >
                    {t(`clients.status.${client.status}`)}
                  </span>
                </TableCell>
                <TableCell>
                  {client.lastInteraction ? format(new Date(client.lastInteraction), 'PP') : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
