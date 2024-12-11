'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Status {
    value: string;
    label: string;
}

interface DataFilterContextProps {
    filteredData: any[];
    setInitialData: (data: any[]) => void;
    searchText: string;
    setSearchText: (text: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    statuses: Status[];
    setStatuses: (statuses: Status[]) => void;
}

const DataFilterContext = createContext<DataFilterContextProps | undefined>(undefined);

export const DataFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [statuses, setStatuses] = useState<Status[]>([]);

    const [initialData, setInitialData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        setFilteredData(initialData);
    }, [initialData]);

    useEffect(() => {
        let data = initialData;
        if (data?.length > 0 && (searchText || selectedStatus)) {
            data = data.filter(
                (fd) =>
                    (fd['title']?.includes(searchText) || fd['briefing']?.includes(searchText)) &&
                    fd['status']?.includes(selectedStatus),
            );
        }

        setFilteredData(data);
    }, [searchText, selectedStatus]);

    return (
        <DataFilterContext.Provider
            value={{
                filteredData,
                statuses,
                setInitialData,
                searchText,
                setSearchText,
                selectedStatus,
                setSelectedStatus,
                setStatuses,
            }}
        >
            {children}
        </DataFilterContext.Provider>
    );
};

export const useDataFilter = () => {
    const context = useContext(DataFilterContext);
    if (!context) {
        throw new Error('useDataFilter must be used within a DataFilterProvider');
    }
    return context;
};
