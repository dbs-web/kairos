import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { useCalendar } from '@/hooks/use-calendar';
import { useEffect, useRef, useState } from 'react';

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

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="basis-1/2 rounded-lg bg-white px-8 py-4 shadow-lg">
            <CalendarHover {...activeEvent} position={hoverPosition} />
            <FullCalendar
                ref={calendarRef}
                locale={ptLocale}
                plugins={[dayGridPlugin]}
                events={events}
                fixedWeekCount={false}
                initialView="dayGridMonth"
                eventClick={setActiveEvent}
                eventMouseEnter={setActiveEvent}
                eventMouseLeave={clearActiveEvent}
            />
        </div>
    );
}

function CalendarHover({ title, date, position }: Event & { position: { x: number; y: number } }) {
    if (!title) return null;
    return (
        <div
            className="pointer-events-none absolute z-[100] h-auto w-72 rounded-lg bg-white p-4 shadow-lg transition-opacity duration-300"
            style={{
                top: position.y + 20,
                left: position.x + 10,
                opacity: title ? 1 : 0,
            }}
        >
            <span className="block font-bold">{title}</span>
            <time className="block text-sm text-gray-500">{date}</time>
        </div>
    );
}
