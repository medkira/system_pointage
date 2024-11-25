import { cn } from '@/presentation/lib/utils'

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps): JSX.Element {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Overview
      </a>
      <a
        href="/attendance"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Attendance
      </a>
      <a
        href="/employees"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Employees
      </a>
    </nav>
  )
}
