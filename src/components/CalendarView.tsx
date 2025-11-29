import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, type Event, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent extends Event {
    title: string;
    start: Date;
    end: Date;
    resource?: {
        type: string;
        description?: string;
    };
}

interface CalendarViewProps {
    isOpen: boolean;
    onClose: () => void;
    events: Array<{
        titulo: string;
        descripcion: string;
        fechainicio: string;
        fechafin: string;
        tipo: string;
    }>;
    schedules: Array<{
        asignatura: string;
        docente: string;
        diasemana: string;
        horainicio: string;
        horafin: string;
        grupo: string;
    }>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ isOpen, onClose, events, schedules }) => {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    // Check for mobile device on mount to set default view
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setView('agenda');
            } else {
                setView('month');
            }
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isOpen]);

    if (!isOpen) return null;

    // Convert events to calendar format
    const calendarEvents: CalendarEvent[] = [];

    // Process events
    if (events) {
        events.forEach(event => {
            calendarEvents.push({
                title: event.titulo,
                start: new Date(event.fechainicio),
                end: new Date(event.fechafin),
                resource: {
                    type: event.tipo,
                    description: event.descripcion
                }
            });
        });
    }

    // Process schedules (recurring events for current week)
    if (schedules) {
        const today = new Date();
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

        // Map days to 0-6 index relative to Monday (0=Monday, 6=Sunday)
        const dayMap: { [key: string]: number } = {
            'Lunes': 0, 'Martes': 1, 'Miércoles': 2, 'Miercoles': 2,
            'Jueves': 3, 'Viernes': 4, 'Sábado': 5, 'Sabado': 5, 'Domingo': 6
        };

        schedules.forEach(schedule => {
            const dayOfWeek = dayMap[schedule.diasemana];
            if (dayOfWeek !== undefined) {
                const scheduleDate = new Date(currentWeekStart);
                scheduleDate.setDate(currentWeekStart.getDate() + dayOfWeek);

                const [startHour, startMinute] = schedule.horainicio.split(':').map(Number);
                const [endHour, endMinute] = schedule.horafin.split(':').map(Number);

                const startTime = new Date(scheduleDate);
                startTime.setHours(startHour, startMinute, 0);

                const endTime = new Date(scheduleDate);
                endTime.setHours(endHour, endMinute, 0);

                calendarEvents.push({
                    title: `${schedule.asignatura} - ${schedule.docente}`,
                    start: startTime,
                    end: endTime,
                    resource: {
                        type: 'Clase',
                        description: `Grupo: ${schedule.grupo}`
                    }
                });
            }
        });
    }

    // Custom event style
    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#4F46E5'; // Default indigo

        if (event.resource?.type === 'Clase') {
            backgroundColor = '#10B981'; // Green for classes
        } else if (event.resource?.type === 'Reunión') {
            backgroundColor = '#F59E0B'; // Orange for meetings
        } else if (event.resource?.type === 'Evento') {
            backgroundColor = '#8B5CF6'; // Purple for events
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                fontSize: '0.75rem',
                padding: '2px 4px'
            }
        };
    };

    const onNavigate = (newDate: Date) => setDate(newDate);
    const onView = (newView: View) => setView(newView);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
            <style>{`
                .rbc-toolbar {
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .rbc-toolbar-label {
                    font-weight: bold;
                    font-size: 1.1em;
                    margin: 5px 0;
                }
                .rbc-btn-group {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                }
                .rbc-btn-group button {
                    flex: 1;
                    white-space: nowrap;
                    font-size: 0.8rem;
                }
                @media (min-width: 768px) {
                    .rbc-toolbar {
                        flex-direction: row;
                    }
                    .rbc-btn-group {
                        width: auto;
                    }
                    .rbc-btn-group button {
                        flex: initial;
                        font-size: 1rem;
                    }
                }
                .rbc-time-view .rbc-header {
                    font-size: 0.8rem;
                }
            `}</style>
            <div className="bg-white w-full h-[95vh] md:h-[90vh] max-w-7xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-white">Calendario Académico</h2>
                        <p className="text-indigo-100 text-xs md:text-sm hidden md:block">Eventos, clases y actividades</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Legend */}
                <div className="px-4 py-2 md:px-6 md:py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-3 text-xs md:text-sm shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-700">Clases</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-700">Reuniones</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-500 rounded"></div>
                        <span className="text-gray-700">Eventos</span>
                    </div>
                </div>

                {/* Calendar */}
                <div className="flex-1 p-2 md:p-6 overflow-hidden flex flex-col">
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        culture="es"
                        messages={{
                            next: "Sig",
                            previous: "Ant",
                            today: "Hoy",
                            month: "Mes",
                            week: "Sem",
                            day: "Día",
                            agenda: "Agenda",
                            date: "Fecha",
                            time: "Hora",
                            event: "Evento",
                            noEventsInRange: "Sin eventos",
                            showMore: (total) => `+${total} más`
                        }}
                        views={['month', 'week', 'day', 'agenda']}
                        view={view}
                        date={date}
                        onNavigate={onNavigate}
                        onView={onView}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
