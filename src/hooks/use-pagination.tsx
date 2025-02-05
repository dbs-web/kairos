import { useState, useEffect } from 'react';

interface UsePagination {
    paginationLimits?: PaginationLimits;
}

type PaginationLimits = {
    sm: number;
    md: number;
    lg: number;
    xl: number;
};

const defaultPaginationlimits: PaginationLimits = {
    sm: 3,
    md: 6,
    lg: 8,
    xl: 12,
};

export const usePagination = (paginationLimits = defaultPaginationlimits) => {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(paginationLimits.md);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            let newLimit = paginationLimits.md;

            if (width <= 768) {
                newLimit = paginationLimits.sm;
            } else if (width <= 1040) {
                newLimit = paginationLimits.md;
            } else if (width <= 1540) {
                newLimit = paginationLimits.lg;
            } else {
                newLimit = paginationLimits.xl;
            }

            setLimit(newLimit);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [paginationLimits]);

    return { page, setPage, limit };
};
