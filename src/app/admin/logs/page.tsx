"use client"
import { ColumnDef } from "@tanstack/react-table"
import { IApiLog } from "@/types/api"

import { useApiLogs } from "@/hooks/use-logs"
import { DataTable } from "@/components/Admin/Logs/DataTable" 
  
export const columns: ColumnDef<IApiLog>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "route",
      header: "Route",
    },
    {
      accessorKey: "body",
      header: "Body",
    },
    {
        accessorKey: "error",
        header: "Error",
      },
      {
        accessorKey: "responseCode",
        header: "Código de Resposta",
      },
      {
        accessorKey: "time",
        header: "Hora",
      },
  ]

export default function Logs(){
    const {logs} = useApiLogs()
 
    return (
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={logs} />
      </div>
    )
}