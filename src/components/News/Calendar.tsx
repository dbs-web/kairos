import { useCallback, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { useCalendar } from '@/hooks/use-calendar';
import { EventClickArg, EventInput } from '@fullcalendar/core/index.js';
import { MdCalendarMonth } from 'react-icons/md';

type Event = {
    title?: string;
    date?: string | null;
};

// Implementação da função debounce
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: number | undefined;
    return function (this: any, ...args: any[]) {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => {
            func.apply(this, args);
        }, wait);
    } as T;
}

export default function Calendar() {
    const calendarRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { events, activeEvent, setActiveEvent, clearActiveEvent } = useCalendar();

    // Convert events to FullCalendar format
    const calendarEvents: EventInput[] = events.map(event => ({
        title: event.title,
        start: event.date,
    }));

    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    // Função que atualiza a posição do mouse
    const handleMouseMove = (e: MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoverPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const debouncedHandleMouseMove = useCallback(debounce(handleMouseMove, 100), []);

    const handleMouseEnter = (info: EventClickArg) => {
        if (containerRef.current) {
            const rectEl = info.el.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            setHoverPosition({
                x: rectEl.left - containerRect.left,
                y: rectEl.bottom - containerRect.top,
            });
        }
        setActiveEvent(info);
    };

    useEffect(() => {
        window.addEventListener('mousemove', debouncedHandleMouseMove);
        return () => {
            window.removeEventListener('mousemove', debouncedHandleMouseMove);
        };
    }, [debouncedHandleMouseMove]);

    return (
        <div className="relative rounded-xl bg-card p-6 shadow-md" ref={containerRef}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MdCalendarMonth className="text-xl text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Calendário</h2>
                </div>
            </div>

            <div className="relative mt-6 transition-all duration-300">
                <CalendarHover {...activeEvent} position={hoverPosition} />
                <FullCalendar
                    ref={calendarRef}
                    locale={ptLocale}
                    plugins={[dayGridPlugin]}
                    events={calendarEvents}
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
                    dayHeaderClassNames="text-foreground/70 uppercase text-xs font-medium py-2"
                    dayCellClassNames="hover:bg-muted/30 transition-colors"
                    eventClassNames="!bg-primary !border-0 !rounded-md shadow-md"
                    titleFormat={{ year: 'numeric', month: 'long' }}
                    height={480}
                />
            </div>
        </div>
    );
}

function CalendarHover({ title, date, position }: Event & { position: { x: number; y: number } }) {
    if (!title) return null;
    return (
        <div
            className="pointer-events-none absolute z-[100] w-72 rounded-lg border border-border bg-card p-3 shadow-lg transition-all duration-200"
            style={{
                top: position.y - 50,
                left: Math.min(position.x - 50, 180),
                opacity: title ? 1 : 0,
                transform: `translateY(${title ? '0' : '-4px'})`,
            }}
        >
            <span className="block font-semibold text-foreground">{title}</span>
            <time className="mt-1 block text-sm text-muted-foreground">{date}</time>
        </div>
    );
}
