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
        <div className="my-8 flex items-center justify-center space-x-4 text-foreground">
            <button
                className="rounded bg-muted/50 px-3 py-2 hover:bg-muted transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted/50"
                onClick={handlePreviousPage}
                disabled={page === 1}
            >
                Anterior
            </button>
            <span>
                Página {page} de {totalPages}
            </span>
            <button
                className="rounded bg-muted/50 px-3 py-2 hover:bg-muted transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted/50"
                onClick={handleNextPage}
                disabled={page === totalPages}
            >
                Próxima
            </button>
        </div>
    );
}