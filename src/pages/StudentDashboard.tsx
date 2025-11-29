import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, LogOut, User, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponseWithContext, type UserContext } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateStudyCertificate, generateStudyProof, generateAttendanceReport, generateGradesReport } from '../lib/pdfGenerator';
import EducationalAnalysisDashboard from '../components/EducationalAnalysisDashboard';
import CalendarView from '../components/CalendarView';


interface Child {
    nombre: string;
    apellido: string;
    correo: string;
    tipodocumento?: string;
    documento?: string;
    grades?: Array<{
        asignatura: string;
        nota: number;
        tipo: string;
        fecha: string;
        periodo?: number;
    }>;
    attendance?: Array<{
        fecha: string;
        estado: string;
    }>;
    stats?: {
        promedioGeneral: number;
        porcentajeAsistencia: number;
        totalInasistencias: number;
        totalEvaluaciones: number;
    };
    tasks?: Array<{
        titulo: string;
        descripcion: string;
        asignatura: string;
        fechaasignacion: string;
        fechaentrega: string;
        tipo: string;
        estado: string;
        fechaentregado?: string;
        nota?: number;
        periodo?: number;
    }>;
    taskStats?: {
        totalTareas: number;
        tareasEntregadas: number;
        tareasPendientes: number;
        tareasAtrasadas: number;
        tareasCalificadas: number;
    };
}

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: '¡Hola! Soy el asistente virtual de EduTech. ¿En qué puedo ayudarte hoy?', isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [children, setChildren] = useState<Child[]>([]);
    const [childrenLoaded, setChildrenLoaded] = useState(false);
    const [institution, setInstitution] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [institutionLoaded, setInstitutionLoaded] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);
    const [showAnalysisDashboard, setShowAnalysisDashboard] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Function to render message text with clickable links
    const renderMessageWithLinks = (text: string, isUser: boolean) => {
        // Regex to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline break-all font-medium ${isUser
                            ? 'text-blue-200 hover:text-blue-100'
                            : 'text-blue-600 hover:text-blue-700'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, historyLoaded]);

    // Load children data and institution/teachers/schedules/events on mount
    useEffect(() => {
        if (user && !childrenLoaded) {
            loadChildrenData();
        }
        if (user && !institutionLoaded) {
            loadInstitutionAndTeachers();
            loadAnnouncements();
            loadResources();
        }
    }, [user, childrenLoaded, institutionLoaded]);

    // Load schedules and events after children data is loaded (for parents) or immediately (for students)
    useEffect(() => {
        if (user && institutionLoaded) {
            // For students, load immediately
            if (user.idrol === 4) {
                loadSchedulesAndEvents();
            }
            // For parents, wait until children are loaded
            else if (user.idrol === 5 && childrenLoaded) {
                loadSchedulesAndEvents();
            }
            // For other roles, load immediately
            else if (user.idrol !== 5) {
                loadSchedulesAndEvents();
            }
        }
    }, [user, institutionLoaded, childrenLoaded]);

    const loadChildrenData = async () => {
        try {
            // Fetch children for parent users (idrol = 5)
            if (user?.idrol === 5) {
                const { data, error } = await supabase
                    .from('padreestudiante')
                    .select(`
                        idestudiante,
                        usuario:idestudiante (
                            idusuario,
                            nombre,
                            apellido,
                            correo,
                            tipodocumento,
                            documento
                        )
                    `)
                    .eq('idpadre', user.idusuario);

                if (error) throw error;

                if (data && data.length > 0) {
                    // Fetch academic data for each child
                    const childrenWithData = await Promise.all(
                        data.map(async (item: any) => {
                            const childId = item.usuario?.idusuario;

                            // Fetch grades
                            const { data: gradesData } = await supabase
                                .from('nota')
                                .select(`
                                    nota,
                                    evaluacion:idevaluacion (
                                        titulo,
                                        tipo,
                                        fecha,
                                        periodo,
                                        docenteasignaturagrupo:iddag (
                                            asignatura:idasignatura (
                                                nombre
                                            )
                                        )
                                    ),
                                    matricula:idmatricula (
                                        idestudiante
                                    )
                                `)
                                .eq('matricula.idestudiante', childId);

                            // Fetch attendance
                            const { data: attendanceData } = await supabase
                                .from('asistencia')
                                .select(`
                                    fecha,
                                    estado,
                                    matricula:idmatricula (
                                        idestudiante
                                    )
                                `)
                                .eq('matricula.idestudiante', childId)
                                .order('fecha', { ascending: false });

                            // Format grades
                            const grades = gradesData?.map((g: any) => ({
                                asignatura: g.evaluacion?.docenteasignaturagrupo?.asignatura?.nombre || 'N/A',
                                nota: g.nota,
                                tipo: g.evaluacion?.tipo || 'N/A',
                                fecha: g.evaluacion?.fecha || new Date().toISOString(),
                                periodo: g.evaluacion?.periodo
                            })) || [];

                            // Format attendance
                            const attendance = attendanceData?.map((a: any) => ({
                                fecha: a.fecha,
                                estado: a.estado
                            })) || [];

                            // Calculate statistics
                            const totalEvaluaciones = grades.length;
                            const promedioGeneral = totalEvaluaciones > 0
                                ? grades.reduce((sum, g) => sum + g.nota, 0) / totalEvaluaciones
                                : 0;

                            const totalAsistencias = attendance.length;
                            const totalPresentes = attendance.filter(a => ['Presente', 'Asistió', 'Asistio'].includes(a.estado)).length;
                            const totalInasistencias = attendance.filter(a => ['Ausente', 'Falta', 'Inasistencia'].includes(a.estado)).length;
                            const porcentajeAsistencia = totalAsistencias > 0
                                ? Math.round((totalPresentes / totalAsistencias) * 100)
                                : 0;

                            // Fetch matricula to get group
                            const { data: matriculaData } = await supabase
                                .from('matricula')
                                .select('idmatricula, idgrupo')
                                .eq('idestudiante', childId)
                                .order('anio', { ascending: false })
                                .limit(1)
                                .single();

                            let tasks: any[] = [];
                            let taskStats = {
                                totalTareas: 0,
                                tareasEntregadas: 0,
                                tareasPendientes: 0,
                                tareasAtrasadas: 0,
                                tareasCalificadas: 0
                            };

                            if (matriculaData) {
                                // Fetch tasks for the group
                                const { data: tasksData } = await supabase
                                    .from('tarea')
                                    .select(`
                                        *,
                                        docenteasignaturagrupo!inner (
                                            idgrupo,
                                            asignatura:idasignatura (
                                                nombre
                                            )
                                        )
                                    `)
                                    .eq('docenteasignaturagrupo.idgrupo', matriculaData.idgrupo);

                                if (tasksData && tasksData.length > 0) {
                                    // Fetch submissions for these tasks
                                    const { data: submissionsData } = await supabase
                                        .from('entregatarea')
                                        .select('*')
                                        .in('idtarea', tasksData.map(t => t.idtarea))
                                        .eq('idmatricula', matriculaData.idmatricula);

                                    const submissionsMap = new Map(submissionsData?.map(s => [s.idtarea, s]) || []);

                                    tasks = tasksData.map((t: any) => {
                                        const submission = submissionsMap.get(t.idtarea);
                                        let estado = 'pendiente';
                                        let fechaentregado = undefined;
                                        let nota = undefined;

                                        if (submission) {
                                            estado = (submission.estado || 'entregada').toLowerCase();
                                            fechaentregado = submission.fechaentrega;
                                            nota = submission.nota;
                                        } else {
                                            const today = new Date();
                                            const dueDate = new Date(t.fechaentrega);
                                            if (today > dueDate) {
                                                estado = 'atrasada';
                                            }
                                        }

                                        return {
                                            titulo: t.titulo,
                                            descripcion: t.descripcion,
                                            asignatura: t.docenteasignaturagrupo?.asignatura?.nombre || 'N/A',
                                            fechaasignacion: t.fechaasignacion,
                                            fechaentrega: t.fechaentrega,
                                            tipo: t.tipo,
                                            estado,
                                            fechaentregado,
                                            nota,
                                            periodo: t.periodo
                                        };
                                    });

                                    // Calculate stats
                                    taskStats.totalTareas = tasks.length;
                                    taskStats.tareasEntregadas = tasks.filter(t => t.estado === 'entregada' || t.estado === 'calificada').length;
                                    taskStats.tareasPendientes = tasks.filter(t => t.estado === 'pendiente').length;
                                    taskStats.tareasAtrasadas = tasks.filter(t => t.estado === 'atrasada').length;
                                    taskStats.tareasCalificadas = tasks.filter(t => t.estado === 'calificada').length;
                                }
                            }

                            return {
                                nombre: item.usuario?.nombre || '',
                                apellido: item.usuario?.apellido || '',
                                correo: item.usuario?.correo || '',
                                tipodocumento: item.usuario?.tipodocumento || '',
                                documento: item.usuario?.documento || '',
                                grades,
                                attendance,
                                stats: {
                                    promedioGeneral,
                                    porcentajeAsistencia,
                                    totalInasistencias,
                                    totalEvaluaciones
                                },
                                tasks,
                                taskStats
                            };
                        })
                    );

                    setChildren(childrenWithData);
                }
            } else if (user?.idrol === 4) {
                // Fetch data for student user
                const childId = user.idusuario;

                // Fetch grades
                const { data: gradesData } = await supabase
                    .from('nota')
                    .select(`
                        nota,
                        evaluacion:idevaluacion (
                            titulo,
                            tipo,
                            fecha,
                            periodo,
                            docenteasignaturagrupo:iddag (
                                asignatura:idasignatura (
                                    nombre
                                )
                            )
                        ),
                        matricula:idmatricula (
                            idestudiante
                        )
                    `)
                    .eq('matricula.idestudiante', childId);

                // Fetch attendance
                const { data: attendanceData } = await supabase
                    .from('asistencia')
                    .select(`
                        fecha,
                        estado,
                        matricula:idmatricula (
                            idestudiante
                        )
                    `)
                    .eq('matricula.idestudiante', childId)
                    .order('fecha', { ascending: false });

                // Format grades
                const grades = gradesData?.map((g: any) => ({
                    asignatura: g.evaluacion?.docenteasignaturagrupo?.asignatura?.nombre || 'N/A',
                    nota: g.nota,
                    tipo: g.evaluacion?.tipo || 'N/A',
                    fecha: g.evaluacion?.fecha || new Date().toISOString(),
                    periodo: g.evaluacion?.periodo
                })) || [];

                // Format attendance
                const attendance = attendanceData?.map((a: any) => ({
                    fecha: a.fecha,
                    estado: a.estado
                })) || [];

                // Calculate statistics
                const totalEvaluaciones = grades.length;
                const promedioGeneral = totalEvaluaciones > 0
                    ? grades.reduce((sum, g) => sum + g.nota, 0) / totalEvaluaciones
                    : 0;

                const totalAsistencias = attendance.length;
                const totalPresentes = attendance.filter(a => ['Presente', 'Asistió', 'Asistio'].includes(a.estado)).length;
                const totalInasistencias = attendance.filter(a => ['Ausente', 'Falta', 'Inasistencia'].includes(a.estado)).length;
                const porcentajeAsistencia = totalAsistencias > 0
                    ? Math.round((totalPresentes / totalAsistencias) * 100)
                    : 0;

                // Fetch matricula to get group
                const { data: matriculaData } = await supabase
                    .from('matricula')
                    .select('idmatricula, idgrupo')
                    .eq('idestudiante', childId)
                    .order('anio', { ascending: false })
                    .limit(1)
                    .single();

                let tasks: any[] = [];
                let taskStats = {
                    totalTareas: 0,
                    tareasEntregadas: 0,
                    tareasPendientes: 0,
                    tareasAtrasadas: 0,
                    tareasCalificadas: 0
                };

                if (matriculaData) {
                    // Fetch tasks for the group
                    const { data: tasksData } = await supabase
                        .from('tarea')
                        .select(`
                            *,
                            docenteasignaturagrupo!inner (
                                idgrupo,
                                asignatura:idasignatura (
                                    nombre
                                )
                            )
                        `)
                        .eq('docenteasignaturagrupo.idgrupo', matriculaData.idgrupo);

                    if (tasksData && tasksData.length > 0) {
                        // Fetch submissions for these tasks
                        const { data: submissionsData } = await supabase
                            .from('entregatarea')
                            .select('*')
                            .in('idtarea', tasksData.map(t => t.idtarea))
                            .eq('idmatricula', matriculaData.idmatricula);

                        const submissionsMap = new Map(submissionsData?.map(s => [s.idtarea, s]) || []);

                        tasks = tasksData.map((t: any) => {
                            const submission = submissionsMap.get(t.idtarea);
                            let estado = 'pendiente';
                            let fechaentregado = undefined;
                            let nota = undefined;

                            if (submission) {
                                estado = (submission.estado || 'entregada').toLowerCase();
                                fechaentregado = submission.fechaentrega;
                                nota = submission.nota;
                            } else {
                                const today = new Date();
                                const dueDate = new Date(t.fechaentrega);
                                if (today > dueDate) {
                                    estado = 'atrasada';
                                }
                            }

                            return {
                                titulo: t.titulo,
                                descripcion: t.descripcion,
                                asignatura: t.docenteasignaturagrupo?.asignatura?.nombre || 'N/A',
                                fechaasignacion: t.fechaasignacion,
                                fechaentrega: t.fechaentrega,
                                tipo: t.tipo,
                                estado,
                                fechaentregado,
                                nota,
                                periodo: t.periodo
                            };
                        });

                        // Calculate stats
                        taskStats.totalTareas = tasks.length;
                        taskStats.tareasEntregadas = tasks.filter(t => t.estado === 'entregada' || t.estado === 'calificada').length;
                        taskStats.tareasPendientes = tasks.filter(t => t.estado === 'pendiente').length;
                        taskStats.tareasAtrasadas = tasks.filter(t => t.estado === 'atrasada').length;
                        taskStats.tareasCalificadas = tasks.filter(t => t.estado === 'calificada').length;
                    }
                }

                const studentData = {
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo,
                    tipodocumento: user.tipodocumento || '',
                    documento: user.documento || '',
                    grades,
                    attendance,
                    stats: {
                        promedioGeneral,
                        porcentajeAsistencia,
                        totalInasistencias,
                        totalEvaluaciones
                    },
                    tasks,
                    taskStats
                };

                setChildren([studentData]);
            }
            setChildrenLoaded(true);
        } catch (error) {
            console.error('Error loading children data:', error);
            setChildrenLoaded(true);
        }
    };

    const loadInstitutionAndTeachers = async () => {
        try {
            // Fetch institution data
            if (user?.idinstitucion) {
                const { data: institutionData, error: instError } = await supabase
                    .from('institucion')
                    .select('*')
                    .eq('idinstitucion', user.idinstitucion)
                    .single();

                if (!instError && institutionData) {
                    setInstitution(institutionData);
                }
            }

            // Fetch teachers (usuarios with idrol = 3)
            const { data: teachersData, error: teachersError } = await supabase
                .from('usuario')
                .select(`
                    nombre,
                    apellido,
                    correo,
                    docenteasignaturagrupo(
                        asignatura:idasignatura(
                            nombre
                        )
                    )
                `)
                .eq('idrol', 3)
                .eq('idinstitucion', user?.idinstitucion);

            if (!teachersError && teachersData) {
                const formattedTeachers = teachersData.map((teacher: any) => ({
                    nombre: teacher.nombre,
                    apellido: teacher.apellido,
                    correo: teacher.correo,
                    asignaturas: teacher.docenteasignaturagrupo?.map((dag: any) => dag.asignatura?.nombre).filter(Boolean) || []
                }));
                setTeachers(formattedTeachers);
            }

            setInstitutionLoaded(true);
        } catch (error) {
            console.error('Error loading institution and teachers:', error);
            setInstitutionLoaded(true);
        }
    };

    const loadAnnouncements = async () => {
        if (!user?.idinstitucion) return;

        try {
            const { data, error } = await supabase
                .from('comunicado')
                .select('*')
                .eq('idinstitucion', user.idinstitucion)
                .order('fecha', { ascending: false })
                .limit(5);

            if (!error && data) {
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    };

    const loadResources = async () => {
        try {
            // Get all resources (simplified query without joins)
            const { data, error } = await supabase
                .from('recurso')
                .select('*');

            if (!error && data) {
                console.log('Resources loaded:', data); // Debug log
                const formattedResources = data.map((r: any) => ({
                    titulo: r.titulo,
                    tipo: r.tipo,
                    url: r.url,
                    asignatura: r.idasignatura ? `Asignatura ${r.idasignatura}` : 'General',
                    grado: r.idgrado ? `Grado ${r.idgrado}` : 'Todos los grados'
                }));
                setResources(formattedResources);
                console.log('Formatted resources:', formattedResources); // Debug log
            } else if (error) {
                console.error('Error loading resources:', error);
            }
        } catch (error) {
            console.error('Error loading resources:', error);
        }
    };

    const loadSchedulesAndEvents = async () => {
        try {
            // Determine which group(s) to fetch schedules for
            let grupoIds: number[] = [];

            if (user?.idrol === 4) {
                // For students, get their grupo from matricula
                const { data: matriculaData } = await supabase
                    .from('matricula')
                    .select('idgrupo')
                    .eq('idestudiante', user.idusuario);

                if (matriculaData && matriculaData.length > 0) {
                    grupoIds = matriculaData.map(m => m.idgrupo);
                }
            } else if (user?.idrol === 5 && children.length > 0) {
                // For parents, get grupos from their children's matriculas
                const childIds = children.map(c => c.correo); // We'll need to get idusuario
                // Fetch children's idusuario
                const { data: childrenData } = await supabase
                    .from('usuario')
                    .select('idusuario')
                    .in('correo', childIds);

                if (childrenData && childrenData.length > 0) {
                    const childUserIds = childrenData.map(c => c.idusuario);
                    const { data: matriculaData } = await supabase
                        .from('matricula')
                        .select('idgrupo')
                        .in('idestudiante', childUserIds);

                    if (matriculaData && matriculaData.length > 0) {
                        grupoIds = [...new Set(matriculaData.map(m => m.idgrupo))];
                    }
                }
            }

            // Fetch schedules for the relevant grupos
            if (grupoIds.length > 0) {
                const { data: schedulesData } = await supabase
                    .from('horario')
                    .select(`
                        diasemana,
                        horainicio,
                        horafin,
                        docenteasignaturagrupo:iddag!inner (
                            asignatura:idasignatura (
                                nombre
                            ),
                            usuario:iddocente (
                                nombre,
                                apellido
                            ),
                            grupo:idgrupo (
                                nombre
                            )
                        )
                    `)
                    .in('docenteasignaturagrupo.idgrupo', grupoIds);

                if (schedulesData) {
                    const formattedSchedules = schedulesData.map((s: any) => ({
                        asignatura: s.docenteasignaturagrupo?.asignatura?.nombre || 'N/A',
                        docente: s.docenteasignaturagrupo?.usuario
                            ? `${s.docenteasignaturagrupo.usuario.nombre} ${s.docenteasignaturagrupo.usuario.apellido}`
                            : 'N/A',
                        diasemana: s.diasemana,
                        horainicio: s.horainicio,
                        horafin: s.horafin,
                        grupo: s.docenteasignaturagrupo?.grupo?.nombre || 'N/A'
                    }));
                    setSchedules(formattedSchedules);
                }
            }

            // Fetch events for the institution
            if (user?.idinstitucion) {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);

                const { data: eventsData } = await supabase
                    .from('evento')
                    .select('*')
                    .eq('idinstitucion', user.idinstitucion)
                    .gte('fechainicio', startOfYear.toISOString()) // Include all events from current year
                    .order('fechainicio', { ascending: true });

                if (eventsData) {
                    const formattedEvents = eventsData.map((e: any) => ({
                        titulo: e.titulo,
                        descripcion: e.descripcion,
                        fechainicio: e.fechainicio,
                        fechafin: e.fechafin,
                        tipo: e.tipo
                    }));
                    setEvents(formattedEvents);
                }
            }
        } catch (error) {
            console.error('Error loading schedules and events:', error);
        }
    };

    const loadConversationHistory = async () => {
        if (historyLoaded) return; // Don't load twice

        try {
            const { data, error } = await supabase
                .from('interaccion')
                .select('*')
                .eq('idusuario', user?.idusuario)
                .order('fecha', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                const historyMessages: { text: string; isUser: boolean }[] = [];

                data.forEach((interaction: any) => {
                    historyMessages.push({ text: interaction.mensaje, isUser: true });
                    if (interaction.respuesta) {
                        historyMessages.push({ text: interaction.respuesta, isUser: false });
                    }
                });

                // Prepend history to current messages (keep greeting at top)
                setMessages(prev => [prev[0], ...historyMessages, ...prev.slice(1)]);
            }
            setHistoryLoaded(true);
        } catch (error) {
            console.error('Error loading conversation history:', error);
            setHistoryLoaded(true);
        }
    };

    const saveInteraction = async (userMessage: string, botResponse: string) => {
        try {
            await supabase
                .from('interaccion')
                .insert({
                    idusuario: user?.idusuario,
                    mensaje: userMessage,
                    respuesta: botResponse,
                    categoria: null,
                    fecha: new Date().toISOString()
                });
        } catch (error) {
            console.error('Error saving interaction:', error);
        }
    };



    const handleSend = async (textToSend?: string) => {
        const messageText = textToSend || input;
        if (!messageText.trim() || !user) return;

        setMessages(prev => [...prev, { text: messageText, isUser: true }]);
        setInput('');
        setIsLoading(true);

        try {
            // Build user context
            const userContext: UserContext = {
                user: {
                    nombre: user.nombre,
                    apellido: user.apellido,
                    rol: user.idrol.toString(),
                    correo: user.correo
                },
                institution: institution ? {
                    nombre: institution.nombre,
                    direccion: institution.direccion,
                    telefono: institution.telefono,
                    correo: institution.correo,
                    tipo: institution.tipo,
                    ciudad: institution.ciudad,
                    departamento: institution.departamento
                } : undefined,
                teachers: teachers.length > 0 ? teachers : undefined,
                schedules: schedules.length > 0 ? schedules : undefined,
                events: events.length > 0 ? events : undefined,
                announcements: announcements.length > 0 ? announcements : undefined,
                resources: resources.length > 0 ? resources : undefined,
                children: children.length > 0 ? children : undefined
            };

            console.log('UserContext resources:', userContext.resources); // Debug log
            console.log('Resources array length:', resources.length); // Debug log

            const response = await getGeminiResponseWithContext(messageText, userContext);

            // Check for action marker
            // Check for action marker
            const actionMatch = response.match(/<<<ACTION:([\s\S]*?)>>>/);
            let displayResponse = response;

            if (actionMatch) {
                try {
                    const action = JSON.parse(actionMatch[1]);
                    displayResponse = response.replace(actionMatch[0], ''); // Remove marker from display

                    // Find student
                    const studentName = action.studentName;
                    let student = children.find(c =>
                        `${c.nombre} ${c.apellido}`.toLowerCase().includes(studentName.toLowerCase()) ||
                        studentName.toLowerCase().includes(c.nombre.toLowerCase())
                    );

                    // Fallback: If only one child exists, use it
                    if (!student && children.length === 1) {
                        student = children[0];
                    }

                    if (student && institution) {
                        // Generate PDF based on type
                        switch (action.type) {
                            case 'CERTIFICADO_ESTUDIO':
                                generateStudyCertificate(student, institution);
                                break;
                            case 'CONSTANCIA_ESTUDIO':
                                generateStudyProof(student, institution);
                                break;
                            case 'REPORTE_ASISTENCIA':
                                generateAttendanceReport(student, institution, student.attendance || []);
                                break;
                            case 'REPORTE_CALIFICACIONES':
                                generateGradesReport(student, institution, student.grades || [], action.period);
                                break;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing action:', e);
                }
            }

            setMessages(prev => [...prev, {
                text: displayResponse,
                isUser: false
            }]);

            // Save interaction to database
            await saveInteraction(messageText, displayResponse);
        } catch (error) {
            const errorMessage = "Lo siento, hubo un error al conectar con el asistente.";
            setMessages(prev => [...prev, {
                text: errorMessage,
                isUser: false
            }]);

            // Save error interaction too
            await saveInteraction(messageText, errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="fixed inset-0 bg-gray-50">
            {/* Header / Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white md:bg-transparent shadow-sm md:shadow-none border-b md:border-none border-gray-100 md:fixed md:top-6 md:right-6 md:left-auto md:w-auto px-4 py-3 md:p-0 flex items-center justify-between md:justify-end gap-3">

                {/* Mobile Brand - Visible only on mobile */}
                <div className="md:hidden flex items-center gap-2 text-indigo-600 font-bold">
                    <Sparkles size={20} />
                    <span>EduTech AI</span>
                </div>

                {/* Actions Container */}
                <div className="flex items-center gap-2 md:gap-3">
                    <div
                        onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                        className="flex items-center gap-2 md:gap-3 bg-indigo-50 md:bg-white px-3 py-2 md:px-4 md:py-3 rounded-full md:shadow-lg md:border border-gray-100 cursor-pointer transition-all duration-300"
                    >
                        <div className={`text-right overflow-hidden transition-all duration-300 ease-in-out ${isProfileExpanded ? 'max-w-[200px] opacity-100 mr-2' : 'max-w-0 opacity-0 md:max-w-[200px] md:opacity-100 md:mr-0'}`}>
                            <p className="text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">
                                {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
                                {user?.idrol === 1 ? 'Administrador' :
                                    user?.idrol === 2 ? 'Rector' :
                                        user?.idrol === 3 ? 'Docente' :
                                            user?.idrol === 4 ? 'Estudiante' :
                                                user?.idrol === 5 ? 'Padre' :
                                                    user?.idrol === 6 ? 'Secretaría' : 'Usuario'}
                            </p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden shrink-0">
                            <User size={16} className="md:w-5 md:h-5" />
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 md:p-3 bg-white text-gray-700 rounded-full shadow-sm md:shadow-lg border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </div>



            {/* Chatbot - Full Screen */}
            <div className="h-full flex flex-col pt-16 md:pt-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                    <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
                        {/* Load History Button */}
                        {!historyLoaded && (
                            <div className="flex justify-center">
                                <button
                                    onClick={loadConversationHistory}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 3v5h5" />
                                        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                                        <path d="M12 7v5l4 2" />
                                    </svg>
                                    Cargar Historial Anterior
                                </button>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] p-3 md:p-4 rounded-2xl text-xs md:text-sm whitespace-pre-wrap ${msg.isUser
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {renderMessageWithLinks(msg.text, msg.isUser)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div >

                {/* Shortcuts - Collapsible */}
                <div className="bg-white border-t border-gray-100 transition-all duration-300 ease-in-out">
                    <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="w-full flex items-center justify-between px-3 md:px-6 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xs font-medium text-gray-600">Preguntas Frecuentes</span>
                        <ChevronDown
                            size={16}
                            className={`text-gray-500 transition-transform duration-300 ${showSuggestions ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSuggestions ? 'max-h-[40vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-3 md:px-6 py-3 overflow-y-auto max-h-[40vh]">
                            <div className="max-w-4xl mx-auto">
                                <div className="space-y-3">
                                    {(user?.idrol === 4 ? [
                                        {
                                            title: 'Académico',
                                            questions: ['¿Cuál es mi promedio general?', 'Ver mis calificaciones', '¿Qué tareas tengo pendientes?']
                                        },
                                        {
                                            title: 'Asistencia y Horarios',
                                            questions: ['¿Cuántas inasistencias tengo?', '¿Cuál es mi horario de clases?']
                                        },
                                        {
                                            title: 'Recursos y Estudio',
                                            questions: ['¿Qué recursos hay para matemáticas?', '¿Dónde puedo estudiar más sobre física?']
                                        },
                                        {
                                            title: 'Documentos',
                                            questions: ['Generar mi certificado de estudio', 'Reporte de calificaciones']
                                        },
                                        {
                                            title: 'Información',
                                            questions: ['¿Qué eventos hay próximamente?', '¿Quién es mi profesor de matemáticas?']
                                        }
                                    ] : user?.idrol === 5 ? [
                                        {
                                            title: 'Rendimiento Académico',
                                            questions: ['¿Cómo es el rendimiento de mi hijo?', 'Ver calificaciones del estudiante', '¿Qué tareas tiene pendientes?']
                                        },
                                        {
                                            title: 'Asistencia',
                                            questions: ['Reporte de asistencia', '¿Cuántas inasistencias tiene?']
                                        },
                                        {
                                            title: 'Recursos Educativos',
                                            questions: ['¿Qué recursos hay disponibles?', 'Materiales de estudio para biología']
                                        },
                                        {
                                            title: 'Documentos',
                                            questions: ['Generar certificado de estudio', 'Constancia de estudio']
                                        },
                                        {
                                            title: 'Información',
                                            questions: ['Información de los docentes', '¿Qué eventos hay próximamente?', 'Horario de clases']
                                        }
                                    ] : [
                                        {
                                            title: 'Información Institucional',
                                            questions: ['Información del colegio', 'Horarios de atención', 'Ubicación y contacto']
                                        },
                                        {
                                            title: 'Eventos y Comunicados',
                                            questions: ['Eventos próximos', '¿Hay comunicados nuevos?']
                                        },
                                        {
                                            title: 'Recursos',
                                            questions: ['¿Qué recursos educativos hay?', 'Trámites disponibles']
                                        }
                                    ]).map((section, idx) => (
                                        <div key={idx}>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">{section.title}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {section.questions.map((question) => (
                                                    <button
                                                        key={question}
                                                        onClick={() => handleSend(question)}
                                                        className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-50 text-indigo-600 text-xs md:text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                                                    >
                                                        {question}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="p-3 md:p-6 bg-white border-t border-gray-200">
                    <div className="max-w-4xl mx-auto">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2 md:gap-3 relative"
                        >
                            {/* Quick Actions Button */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowQuickActions(!showQuickActions)}
                                    className="p-3 md:p-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Sparkles size={18} className="md:w-5 md:h-5" />
                                </button>

                                {/* Quick Actions Menu */}
                                <AnimatePresence>
                                    {showQuickActions && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                                        >
                                            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Acciones Rápidas</p>
                                            {[
                                                { label: 'Análisis educativo', prompt: 'Dame un análisis completo del rendimiento académico' },
                                                { label: 'Recursos integrados', prompt: 'Muéstrame los recursos educativos disponibles' },
                                                { label: 'Calendario', prompt: 'Muéstrame mi horario de clases y próximos eventos' }
                                            ].map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        if (action.label === 'Análisis educativo') {
                                                            setShowAnalysisDashboard(true);
                                                        } else if (action.label === 'Calendario') {
                                                            setShowCalendar(true);
                                                        } else {
                                                            handleSend(action.prompt);
                                                        }
                                                        setShowQuickActions(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors text-sm text-gray-700 hover:text-indigo-600"
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu pregunta aquí..."
                                disabled={isLoading}
                                className="flex-1 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xs md:text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-3 md:p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} className="md:w-5 md:h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div >

            {/* Educational Analysis Dashboard Modal */}
            {user && (
                <EducationalAnalysisDashboard
                    isOpen={showAnalysisDashboard}
                    onClose={() => setShowAnalysisDashboard(false)}
                    userContext={{
                        user: {
                            nombre: user.nombre,
                            apellido: user.apellido,
                            rol: user.idrol.toString(),
                            correo: user.correo
                        },
                        institution: institution ? {
                            nombre: institution.nombre,
                            direccion: institution.direccion,
                            telefono: institution.telefono,
                            correo: institution.correo,
                            tipo: institution.tipo,
                            ciudad: institution.ciudad,
                            departamento: institution.departamento
                        } : undefined,
                        teachers: teachers.length > 0 ? teachers : undefined,
                        schedules: schedules.length > 0 ? schedules : undefined,
                        events: events.length > 0 ? events : undefined,
                        announcements: announcements.length > 0 ? announcements : undefined,
                        resources: resources.length > 0 ? resources : undefined,
                        children: children.length > 0 ? children : undefined
                    }}
                />
            )}

            {/* Calendar Modal */}
            <CalendarView
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                events={events}
                schedules={schedules}
            />
        </div >
    );
};

export default StudentDashboard;
