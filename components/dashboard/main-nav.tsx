import Link from "components/active_link"
import AuthContext from "components/auth_context"

import { useContext } from 'react';
import { cn } from "~/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const auth_context = useContext(AuthContext)
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        activeStyle={{ color: 'var(--foreground)' }}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      {
        auth_context.isAdmin && (<Link
          href="/dashboard/funcionarios"
          activeStyle={{ color: 'var(--foreground)' }}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Funcionários
        </Link>)
      }
      <Link
        href="/dashboard/clientes"
        activeStyle={{ color: 'var(--foreground)' }}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Clientes
      </Link>
      <Link
        href="/dashboard/agendamentos"
        activeStyle={{ color: 'var(--foreground)' }}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Agendamentos
      </Link>
    </nav>
  )
}