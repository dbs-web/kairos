import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { IApiLog } from '@/domain/entities/api-log';

import { useApiLogs } from '@/hooks/use-logs';
import { DataTable } from '@/components/Admin/Logs/DataTable';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Pagination from '@/components/ui/pagination';

const columns: ColumnDef<IApiLog>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        enableColumnFilter: false,
        enableSorting: true,
    },
    {
        accessorKey: 'route',
        header: 'Rota',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => row.getValue('route'),
    },
    {
        accessorKey: 'body',
        header: 'Body da Requisição',
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
            const raw: {} = row.getValue('body');
            return (
                <Dialog>
                    <DialogTrigger>
                        <span className="rounded-lg bg-primary p-1.5 text-white transition-all duration-300 hover:bg-secondary">
                            Ver Body
                        </span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Body</DialogTitle>
                        </DialogHeader>
                        <textarea
                            className="h-96 p-2"
                            value={JSON.stringify(raw, null, 4)}
                            readOnly
                        />
                    </DialogContent>
                </Dialog>
            );
        },
    },
    {
        accessorKey: 'error',
        header: 'Erro',
        enableColumnFilter: false,
        enableSorting: true,
    },
    {
        accessorKey: 'responseCode',
        header: 'Código de Resposta',
        enableSorting: true,
        cell: ({ row }) => {
            const responseCode: number = row.getValue('responseCode');
            return (
                <div
                    className="data-[success=false]:text-red-500 data-[success=true]:text-green-500"
                    data-success={responseCode >= 200 && responseCode < 300}
                >
                    {responseCode}
                </div>
            );
        },
        filterFn: 'equals',
    },
    {
        accessorKey: 'time',
        header: 'Hora',
        enableSorting: true,
        cell: ({ row }) => {
            const date: string = row.getValue('time');
            const datestring = `${new Date(date).toLocaleDateString('pt-br')} ${new Date(date).toLocaleTimeString('pt-br')}`;
            return <div>{datestring}</div>;
        },
    },
];

export default function LogTable() {
    const { logs, page, totalPages, setPage } = useApiLogs();

    return (
        <ScrollArea className="mb-8 h-full space-y-12">
            <DataTable columns={columns} data={logs} />
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </ScrollArea>
    );
}
