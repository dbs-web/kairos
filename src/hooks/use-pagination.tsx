import { useState, useEffect } from 'react';

export const usePagination = (max: number = 8) => {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(8);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            let newLimit = 8;
            if (width <= 768) {
                newLimit = 3;
            } else if (width <= 1040) {
                newLimit = 6;
            } else if (width <= 1540) {
                newLimit = 8;
            } else {
                newLimit = 12;
            }

            setLimit(Math.min(newLimit, max));
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return { page, setPage, limit };
};
