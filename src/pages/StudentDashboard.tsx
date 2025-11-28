import { useState, useEffect } from 'react';
import { Send, Loader2, LogOut, User } from 'lucide-react';
import { getGeminiResponseWithContext, type UserContext } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateStudyCertificate, generateStudyProof, generateAttendanceReport, generateGradesReport } from '../lib/pdfGenerator';


interface Child {
    nombre: string;
    apellido: string;
    correo: string;
    grades?: Array<{
        asignatura: string;
        nota: number;
        tipo: string;
        fecha: string;
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
    const [institutionLoaded, setInstitutionLoaded] = useState(false);

    // Load children data and institution/teachers on mount (NOT history - user must click button)
    useEffect(() => {
        if (user && !childrenLoaded) {
            loadChildrenData();
        }
        if (user && !institutionLoaded) {
            loadInstitutionAndTeachers();
        }
    }, [user, childrenLoaded, institutionLoaded]);

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
                            correo
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
                                fecha: g.evaluacion?.fecha || new Date().toISOString()
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
                            const totalPresentes = attendance.filter(a => a.estado === 'Presente').length;
                            const totalInasistencias = attendance.filter(a => a.estado === 'Ausente').length;
                            const porcentajeAsistencia = totalAsistencias > 0
                                ? Math.round((totalPresentes / totalAsistencias) * 100)
                                : 0;

                            return {
                                nombre: item.usuario?.nombre || '',
                                apellido: item.usuario?.apellido || '',
                                correo: item.usuario?.correo || '',
                                grades,
                                attendance,
                                stats: {
                                    promedioGeneral,
                                    porcentajeAsistencia,
                                    totalInasistencias,
                                    totalEvaluaciones
                                }
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
                    fecha: g.evaluacion?.fecha || new Date().toISOString()
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
                const totalPresentes = attendance.filter(a => a.estado === 'Presente').length;
                const totalInasistencias = attendance.filter(a => a.estado === 'Ausente').length;
                const porcentajeAsistencia = totalAsistencias > 0
                    ? Math.round((totalPresentes / totalAsistencias) * 100)
                    : 0;

                const studentData = {
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo,
                    grades,
                    attendance,
                    stats: {
                        promedioGeneral,
                        porcentajeAsistencia,
                        totalInasistencias,
                        totalEvaluaciones
                    }
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
                children: children.length > 0 ? children : undefined
            };

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
                                generateGradesReport(student, institution, student.grades || []);
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
            {/* Floating User Icon - Top Right */}
            <div className="fixed top-6 right-6 z-50">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg border border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">
                            {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.idrol === 1 ? 'Administrador' :
                                user?.idrol === 2 ? 'Rector' :
                                    user?.idrol === 3 ? 'Docente' :
                                        user?.idrol === 4 ? 'Estudiante' :
                                            user?.idrol === 5 ? 'Padre' :
                                                user?.idrol === 6 ? 'Secretaría' : 'Usuario'}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
                        {user?.urlfotoperfil ? (
                            <img src={user.urlfotoperfil} alt="Perfil" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Button - Bottom Right */}
            <button
                onClick={handleLogout}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-full shadow-lg border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Cerrar Sesión</span>
            </button>

            {/* Chatbot - Full Screen */}
            <div className="h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="max-w-4xl mx-auto space-y-4">
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
                                    className={`max-w-[75%] p-4 rounded-2xl text-sm ${msg.isUser
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
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
                    </div>
                </div >

                {/* Shortcuts */}
                {
                    messages.length === 1 && (
                        <div className="px-6 py-3 bg-white border-t border-gray-100">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-xs text-gray-500 mb-2">Preguntas sugeridas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Horarios', 'Calificaciones', 'Asistencia', 'Próximas actividades', 'Información del colegio'].map((shortcut) => (
                                        <button
                                            key={shortcut}
                                            onClick={() => handleSend(shortcut)}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                                        >
                                            {shortcut}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Input */}
                <div className="p-6 bg-white border-t border-gray-200">
                    <div className="max-w-4xl mx-auto">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-3"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu pregunta aquí..."
                                disabled={isLoading}
                                className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default StudentDashboard;
