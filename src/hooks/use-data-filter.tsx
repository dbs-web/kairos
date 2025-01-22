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
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchText);

    // Normalize text field
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

    // Apply debounce to searchText
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500); // Adjust debounce time (in ms) as needed

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    useEffect(() => {
        setFilteredData(initialData);
    }, [initialData]);

    useEffect(() => {
        let data = initialData;

        // Text Filter (debounced)
        if (debouncedSearchText) {
            data = data.filter((item) => filterByText(item, debouncedSearchText));
        }

        // Status Filter
        if (selectedStatus) {
            data = data.filter((fd) => fd['status']?.includes(selectedStatus));
        }

        setFilteredData(data);
    }, [debouncedSearchText, selectedStatus, initialData]);

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
