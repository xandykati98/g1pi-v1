"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { dateToDDMMYYYY } from "~/utils/datestuff"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { MoreHorizontal, Box, TrashIcon, ClipboardCopy } from "lucide-react"
 
import { Button } from "components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
import { Checkbox } from "components/ui/checkbox"
import { AgendamentoJoin } from "~/server/api/routers/agendamento"
 

export const columns: ColumnDef<AgendamentoJoin>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
        accessorKey: "cliente.nome",
        header: "Nome do cliente",
    },
    {
        accessorKey: "funcionario.nome",
        header: "Nome do funcionário",
    },
    {
        accessorKey: "descricao",
        header: "Descrição",
    },
    {
        accessorKey: "data",
        header: "Data de execução",
        cell: ({ row }) => {
            return dateToDDMMYYYY(new Date(row.original.data))
        },
    },
    {
        accessorKey: "createdAt",
        header: "Data de cadastro",
        cell: ({ row }) => {
            return dateToDDMMYYYY(new Date(row.original.createdAt))
        },
    },
    {
        accessorKey: "confirmado",
        header: "Confirmado",
        cell: ({ row }) => {
            return row.original.confirmado ? 'Confirmado' : 'Pendente' 
        }
    },
    {
        accessorKey: "preco",
        header: "Preço",
        cell: ({ row }) => {
            return `R$ ${row.original.preco || 0}`
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            interface ClienteMutate extends AgendamentoJoin {
                mutateExcluir: () => void
                mutateToggleStatus: () => void
            }
            const agendamento = row.original as ClienteMutate
            return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={agendamento.mutateToggleStatus}><Box className="mr-2 h-4 w-4"/> Alterar status </DropdownMenuItem>
                <DropdownMenuItem onClick={agendamento.mutateExcluir}><TrashIcon className="mr-2 h-4 w-4"/> Excluir </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void navigator.clipboard.writeText(agendamento.id)}><ClipboardCopy className="mr-2 h-4 w-4"/> Copiar ID do agendamento</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
    },
]
