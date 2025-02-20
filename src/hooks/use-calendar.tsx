'use client';

import { useState } from 'react';
import { EventHoveringArg } from '@fullcalendar/core/index.js';

// Hooks
import { useFetchData } from './use-fetch-data';

type Event = {
    title: string;
    date: string | null;
};

interface useCalendarReturn {
    events: Event[];
    isLoading: boolean;
    activeEvent: Event | null;
    setActiveEvent: (mouseEvent: EventHoveringArg) => void;
    clearActiveEvent: () => void;
}

export const useCalendar = (): useCalendarReturn => {
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);

    const { data, isLoading } = useFetchData<Event>('events', {}, 'events');

    const handleSetActiveEvent = (mouseEvent: EventHoveringArg) => {
        setActiveEvent({
            title: mouseEvent.event.title,
            date: mouseEvent.event.start?.toString() || null,
        });
    };

    const clearActiveEvent = () => {
        setActiveEvent(null);
    };

    const events = data?.data || [];
    return {
        events,
        isLoading,
        activeEvent,
        setActiveEvent: handleSetActiveEvent,
        clearActiveEvent,
    };
};
