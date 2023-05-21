import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { AgendamentoJoin } from "~/server/api/routers/agendamento";
import { api } from "~/utils/api"
import { dateToDDMMYYYY } from "~/utils/datestuff";
import { getSigla } from "~/utils/stringstuff";

export function RecentSales({
  data, isLoading
}: {
  data: AgendamentoJoin[]
  isLoading: boolean
}) {
  
  if (isLoading) return <div></div>

  return (
    <div className="space-y-8">
      {
        data?.map((agendamento) => {
          return <div key={agendamento.id} className="flex items-center">
            {
              agendamento.clienteId && <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{getSigla(agendamento.cliente.nome)}</AvatarFallback>
              </Avatar>
            }
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{ agendamento?.cliente?.nome || 'Anônimo'}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-bold">{dateToDDMMYYYY(agendamento.data)} </span>
                {agendamento.descricao}
              </p>
            </div>
            <div className="ml-auto font-medium">R${agendamento.preco}</div>
          </div>
        })
      }
    </div>
  )
}
