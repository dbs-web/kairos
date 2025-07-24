import React, { useState, useEffect } from 'react';

export function TabWithCounter({ type, children }: { type: 'briefings' | 'videos', children: React.ReactNode }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch(`/api/notifications/count?type=${type}`);

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setCount(data.count || 0);
            } catch (error) {
                // Silently handle errors
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [type]);

    return (
        <div className="relative z-20">
            {children}
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 z-30 min-w-[20px] h-5 flex items-center justify-center font-semibold shadow-lg">
                    {count}
                </span>
            )}
        </div>
    );
}