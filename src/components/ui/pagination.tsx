interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="mb-8 flex items-center justify-center space-x-4">
            <button
                className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-200/50 disabled:text-neutral-400"
                onClick={handlePreviousPage}
                disabled={page === 1}
            >
                Anterior
            </button>
            <span>
                Página {page} de {totalPages}
            </span>
            <button
                className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-200/50 disabled:text-neutral-400"
                onClick={handleNextPage}
                disabled={page === totalPages}
            >
                Próxima
            </button>
        </div>
    );
}
