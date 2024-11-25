import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface EmployeeTableProps {
  type: 'declared' | 'undeclared'
}

export function EmployeeTable({ type }: EmployeeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            {type === 'declared' && (
              <>
                <TableHead>Contract Type</TableHead>
                <TableHead>Start Date</TableHead>
              </>
            )}
            {type === 'undeclared' && (
              <>
                <TableHead>Working Since</TableHead>
                <TableHead>Declaration Status</TableHead>
              </>
            )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">EMP001</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>Developer</TableCell>
            <TableCell>Active</TableCell>
            {type === 'declared' && (
              <>
                <TableCell>Full-time</TableCell>
                <TableCell>2023-01-15</TableCell>
              </>
            )}
            {type === 'undeclared' && (
              <>
                <TableCell>2023-06-01</TableCell>
                <TableCell>Pending</TableCell>
              </>
            )}
            <TableCell>{/* Add action buttons here */}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
