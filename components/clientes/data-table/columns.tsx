"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { dateToDDMMYYYY } from "~/utils/datestuff"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
 
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
 

export const columns: ColumnDef<User>[] = [
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
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "createdAt",
        header: "Data de cadastro",
        cell: ({ row }) => {
            return dateToDDMMYYYY(new Date(row.original.createdAt))
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original
    
            return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => void navigator.clipboard.writeText(payment.id)}
                >
                    Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
    },
]
