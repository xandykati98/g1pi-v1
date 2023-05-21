"use client"

import { User } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table"
import React from "react"
import { api } from "~/utils/api"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface DataTablePropsWithRefetch<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  refetch: () => Promise<any>,
  deleteMutate: (ids: string[]) => Promise<{ ok: boolean }>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  refetch,
  deleteMutate
}: DataTablePropsWithRefetch<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })
  const onDelete = async () => {
    try {
      const selectedRows = table.getRowModel().rows.filter((row) =>
        row.getIsSelected()
      )
      const ids = selectedRows.map((row) => (row.original as { id: string }).id)
      const { ok } = await deleteMutate(ids)
      if (ok) {
        alert('Itens deletados com sucesso!')
        await refetch()
        setRowSelection({})
      } else throw new Error('Algo de errado aconteceu!')
    } catch (error) {
      alert(error)
    }
  }
  return (
    <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum cliente com esses parametros.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    
    <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} item(s) selecionados.
          {
            table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button variant={'destructive'} onClick={() => {void onDelete()}} className="ml-4">Deletar items</Button>
            )
          }
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </>
  )
}
