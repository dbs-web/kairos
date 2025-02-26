import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { useCalendar } from '@/hooks/use-calendar';
import { useEffect, useRef, useState } from 'react';
import { EventClickArg } from '@fullcalendar/core/index.js';
import { MdExpandMore, MdExpandLess, MdCalendarMonth } from 'react-icons/md';

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
        setHoverPosition({ x: e.clientX, y: e.clientY });
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
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MdCalendarMonth className="text-xl text-primary" />
                    <h2 className="text-xl font-semibold text-neutral-900">Calendário</h2>
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 max-h-[600px] mt-6`}
            >
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
                    height={450}
                />
            </div>
        </div>
    );
}

function CalendarHover({ title, date, position }: Event & { position: { x: number; y: number } }) {
    if (!title) return null;
    return (
        <div
            className="pointer-events-none absolute z-[100] w-72 rounded-lg border border-neutral-100 bg-white p-3 shadow-lg transition-all duration-200"
            style={{
                top: position.y - 280,
                left: position.x - 50,
                opacity: title ? 1 : 0,
                transform: `translateY(${title ? '0' : '-4px'})`,
            }}
        >
            <span className="block font-semibold text-neutral-900">{title}</span>
            <time className="mt-1 block text-sm text-neutral-500">{date}</time>
        </div>
    );
}
