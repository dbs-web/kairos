import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { useCalendar } from '@/hooks/use-calendar';
import { useEffect, useRef, useState } from 'react';
import { EventClickArg, EventHoveringArg } from '@fullcalendar/core';

interface CalendarEvent {
    title: string;
    date: string;
    start: Date;
}

export default function Calendar() {
    const calendarRef = useRef<HTMLDivElement>(null);
    const { events, isLoading, activeEvent, setActiveEvent, clearActiveEvent } = useCalendar();
    const [hoverEvent, setHoverEvent] = useState<CalendarEvent | null>(null);
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const handleMouseEnter = (info: EventHoveringArg) => {
        if (!info.event) return;

        const rect = info.el.getBoundingClientRect();
        const calendarRect = calendarRef.current?.getBoundingClientRect();

        if (calendarRect) {
            setHoverPosition({
                x: rect.left - calendarRect.left,
                y: rect.top - calendarRect.top + rect.height + 4,
            });

            setHoverEvent({
                title: info.event.title || '',
                date: info.event.start?.toLocaleDateString('pt-BR') || '',
                start: info.event.start || new Date(),
            });
        }
    };

    const handleMouseLeave = () => {
        setHoverEvent(null);
    };

    return (
        <div
            ref={calendarRef}
            className="relative basis-1/2 overflow-hidden rounded-xl bg-white p-6 shadow-sm"
        >
            <FullCalendar
                locale={ptLocale}
                plugins={[dayGridPlugin]}
                events={events}
                fixedWeekCount={false}
                initialView="dayGridMonth"
                eventClick={setActiveEvent}
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                headerToolbar={{
                    start: 'title',
                    center: '',
                    end: 'prev,next',
                }}
                dayHeaderClassNames="text-neutral-600 uppercase text-xs font-medium py-2"
                dayCellClassNames="hover:bg-neutral-50 transition-colors"
                eventClassNames="!bg-primary !border-0 !rounded-md shadow-sm"
                titleFormat={{ year: 'numeric', month: 'long' }}
                height="auto"
                buttonIcons={{
                    prev: 'chevron-left',
                    next: 'chevron-right',
                }}
                buttonClassNames={{
                    prev: '!bg-primary !text-white hover:!bg-primary/90 [&>.fc-icon]:!text-white',
                    next: '!bg-primary !text-white hover:!bg-primary/90 [&>.fc-icon]:!text-white',
                }}
            />
            {hoverEvent && (
                <CalendarHover
                    title={hoverEvent.title}
                    date={hoverEvent.date}
                    position={hoverPosition}
                />
            )}
        </div>
    );
}

function CalendarHover({
    title,
    date,
    position,
}: {
    title: string;
    date: string;
    position: { x: number; y: number };
}) {
    if (!title) return null;

    return (
        <div
            className="pointer-events-none absolute z-[100] w-72 rounded-lg border border-neutral-100 bg-white p-3 shadow-lg transition-all duration-75"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                opacity: 1,
                transform: 'translateY(0)',
            }}
        >
            <span className="block font-semibold text-neutral-900">{title}</span>
            <time className="mt-1 block text-sm text-neutral-500">{date}</time>
        </div>
    );
}
