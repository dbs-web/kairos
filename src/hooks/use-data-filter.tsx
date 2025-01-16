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
    const [selectedStatus, setSelectedStatus] = useState<string>(''); // Make selectedStatus optional (default empty)

    // Normalize text fied
    const normalizeText = (text: string) => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    const filterByText = (data: any, query: string) => {
        return Object.keys(data).some((key) => {
            const value = data[key];

            // Filter by all text fields on object
            if (typeof value === 'string' && normalizeText(value).includes(normalizeText(query))) {
                return true;
            }
            return false;
        });
    };

    useEffect(() => {
        setFilteredData(initialData);
    }, [initialData]);

    useEffect(() => {
        let data = initialData;

        // Text Filter
        if (searchText) {
            data = data.filter((item) => filterByText(item, searchText));
        }

        // Status Filter
        if (selectedStatus) {
            data = data.filter((fd) => fd['status']?.includes(selectedStatus));
        }

        setFilteredData(data);
    }, [searchText, selectedStatus, initialData]);

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
