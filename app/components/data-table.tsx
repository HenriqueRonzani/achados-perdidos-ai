'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  tableClassName?: string
}

export function DataTable<TData>({ data, columns, tableClassName = '' }: DataTableProps<TData>) {
// eslint-disable-next-line react-hooks/incompatible-library 
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-lg border">
<table className={`w-full table-fixed ${tableClassName}`}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id} 
                  style={{ width: header.getSize() }} 
                  className="px-4 py-3 text-left font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
