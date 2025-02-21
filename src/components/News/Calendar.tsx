import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { useCalendar } from '@/hooks/use-calendar';
import { useEffect, useRef, useState } from 'react';
import { EventClickArg } from '@fullcalendar/core/index.js';

type Event = {
    title?: string | undefined;
    date?: string | null | undefined;
};

export default function Calendar() {
    const calendarRef = useRef(null);

    const { events, isLoading, activeEvent, setActiveEvent, clearActiveEvent } = useCalendar();
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const handleMouseMove = (e: MouseEvent) => {
        setHoverPosition({ x: Math.min(e.clientX, 1500), y: e.clientY });
    };

    const handleMouseEnter = (info: EventClickArg) => {
        const rect = info.el.getBoundingClientRect();
        setHoverPosition({
            x: rect.left,
            y: rect.bottom,
        });
        setActiveEvent(info);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="basis-1/2 rounded-xl bg-white p-6 shadow-sm">
            <CalendarHover {...activeEvent} position={hoverPosition} />
            <FullCalendar
                ref={calendarRef}
                locale={ptLocale}
                plugins={[dayGridPlugin]}
                // @ts-expect-error events are just placeholders ATM
                events={events}
                fixedWeekCount={false}
                initialView="dayGridMonth"
                eventClick={setActiveEvent}
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={clearActiveEvent}
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
                    prev: '!bg-primary !text-white hover:!bg-primary/90',
                    next: '!bg-primary !text-white hover:!bg-primary/90',
                }}
            />
        </div>
    );
}

function CalendarHover({ title, date, position }: Event & { position: { x: number; y: number } }) {
    if (!title) return null;
    return (
        <div
            className="pointer-events-none absolute z-[100] w-72 rounded-lg border border-neutral-100 bg-white p-3 shadow-lg transition-all duration-200"
            style={{
                top: position.y + 8, // Reduced offset
                left: position.x,
                opacity: title ? 1 : 0,
                transform: `translateY(${title ? '0' : '-4px'})`,
            }}
        >
            <span className="block font-semibold text-neutral-900">{title}</span>
            <time className="mt-1 block text-sm text-neutral-500">{date}</time>
        </div>
    );
}
