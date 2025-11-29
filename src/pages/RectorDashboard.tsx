import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    TrendingUp,
    Activity,
    School,
    Clock,
    LogOut
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const RectorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        averageAttendance: 0
    });
    const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [attendanceTrend, setAttendanceTrend] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        try {
            if (!user?.idinstitucion) return;

            // 1. Fetch Basic Stats
            const { count: studentCount } = await supabase
                .from('usuario')
                .select('*', { count: 'exact', head: true })
                .eq('idrol', 4) // Estudiante
                .eq('idinstitucion', user.idinstitucion);

            const { count: teacherCount } = await supabase
                .from('usuario')
                .select('*', { count: 'exact', head: true })
                .eq('idrol', 3) // Docente
                .eq('idinstitucion', user.idinstitucion);

            const { count: courseCount } = await supabase
                .from('asignatura')
                .select('*', { count: 'exact', head: true });
            // Assuming asignaturas are global or linked via another way, if not filter by institution if possible

            // 2. Fetch Enrollment by Grade (Grupo)
            // Fetch groups
            const { data: groupsData } = await supabase
                .from('grupo')
                .select('idgrupo, nombre')
                .eq('idinstitucion', user.idinstitucion);

            let enrollmentChartData: any[] = [];

            if (groupsData && groupsData.length > 0) {
                const groupIds = groupsData.map(g => g.idgrupo);

                // Fetch matriculas for these groups
                const { data: matriculaData } = await supabase
                    .from('matricula')
                    .select('idgrupo')
                    .in('idgrupo', groupIds);

                const countMap = new Map();
                matriculaData?.forEach((m: any) => {
                    countMap.set(m.idgrupo, (countMap.get(m.idgrupo) || 0) + 1);
                });

                enrollmentChartData = groupsData.map((g: any) => ({
                    name: g.nombre,
                    estudiantes: countMap.get(g.idgrupo) || 0
                }));
            }

            // 3. Fetch Performance (Average Grades by Subject)
            // This is complex, simplifying by fetching a sample of recent grades
            const { data: gradesData } = await supabase
                .from('nota')
                .select(`
                    nota,
                    evaluacion:idevaluacion (
                        docenteasignaturagrupo:iddag (
                            asignatura:idasignatura (
                                nombre
                            )
                        )
                    )
                `)
                .limit(100); // Limit for performance

            const subjectGrades: { [key: string]: { sum: number, count: number } } = {};
            gradesData?.forEach((g: any) => {
                const subject = g.evaluacion?.docenteasignaturagrupo?.asignatura?.nombre;
                if (subject) {
                    if (!subjectGrades[subject]) subjectGrades[subject] = { sum: 0, count: 0 };
                    subjectGrades[subject].sum += g.nota;
                    subjectGrades[subject].count += 1;
                }
            });

            const performanceChartData = Object.keys(subjectGrades).map(subject => ({
                subject,
                promedio: Math.round((subjectGrades[subject].sum / subjectGrades[subject].count) * 10) / 10
            }));

            // 4. Fetch Attendance Trend (Last 7 days)
            const today = new Date();
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

            const { data: attendanceData } = await supabase
                .from('asistencia')
                .select('fecha, estado')
                .gte('fecha', lastWeek.toISOString())
                .order('fecha', { ascending: true });

            const dailyAttendance: { [key: string]: { present: number, total: number } } = {};
            attendanceData?.forEach((a: any) => {
                const date = new Date(a.fecha).toLocaleDateString();
                if (!dailyAttendance[date]) dailyAttendance[date] = { present: 0, total: 0 };
                dailyAttendance[date].total += 1;
                if (['Presente', 'Asistió', 'Asistio'].includes(a.estado)) {
                    dailyAttendance[date].present += 1;
                }
            });

            const attendanceChartData = Object.keys(dailyAttendance).map(date => ({
                date,
                asistencia: Math.round((dailyAttendance[date].present / dailyAttendance[date].total) * 100)
            }));

            // Calculate average attendance for stats
            const totalAttendanceRecords = attendanceData?.length || 0;
            const totalPresent = attendanceData?.filter((a: any) => ['Presente', 'Asistió', 'Asistio'].includes(a.estado)).length || 0;
            const avgAttendance = totalAttendanceRecords > 0 ? Math.round((totalPresent / totalAttendanceRecords) * 100) : 0;

            // 5. Recent Activity (Announcements + Events)
            const { data: announcements } = await supabase
                .from('comunicado')
                .select('*')
                .eq('idinstitucion', user.idinstitucion)
                .order('fecha', { ascending: false })
                .limit(3);

            const { data: events } = await supabase
                .from('evento')
                .select('*')
                .eq('idinstitucion', user.idinstitucion)
                .gte('fechainicio', new Date().toISOString())
                .order('fechainicio', { ascending: true })
                .limit(3);

            const activity = [
                ...(announcements?.map(a => ({ ...a, type: 'comunicado', date: a.fecha })) || []),
                ...(events?.map(e => ({ ...e, type: 'evento', date: e.fechainicio })) || [])
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


            setStats({
                totalStudents: studentCount || 0,
                totalTeachers: teacherCount || 0,
                totalCourses: courseCount || 0,
                averageAttendance: avgAttendance
            });
            setEnrollmentData(enrollmentChartData);
            setPerformanceData(performanceChartData);
            setAttendanceTrend(attendanceChartData);
            setRecentActivity(activity);
            setLoading(false);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="transition-all duration-300">
                <div className="p-6 max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Panel del Rector</h1>
                            <p className="text-gray-500 mt-1">Bienvenido, {user?.nombre} {user?.apellido}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                                <Calendar size={20} className="text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="text-sm font-medium">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Total Estudiantes"
                            value={stats.totalStudents}
                            icon={Users}
                            bgColor="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                        <StatsCard
                            title="Total Docentes"
                            value={stats.totalTeachers}
                            icon={GraduationCap}
                            bgColor="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                        <StatsCard
                            title="Asignaturas"
                            value={stats.totalCourses}
                            icon={BookOpen}
                            bgColor="bg-indigo-100"
                            iconColor="text-indigo-600"
                        />
                        <StatsCard
                            title="Asistencia Promedio"
                            value={`${stats.averageAttendance}%`}
                            icon={Activity}
                            bgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Enrollment Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <School size={20} className="text-indigo-600" />
                                Estudiantes por Grado
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={enrollmentData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: '#f3f4f6' }}
                                        />
                                        <Bar dataKey="estudiantes" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Performance Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-green-600" />
                                Rendimiento Académico Promedio
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" domain={[0, 5]} hide />
                                        <YAxis dataKey="subject" type="category" width={100} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: '#f3f4f6' }}
                                        />
                                        <Bar dataKey="promedio" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Attendance Trend */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-orange-500" />
                                Tendencia de Asistencia (Últimos 7 días)
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChartWrapper data={attendanceTrend} />
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Actividad Reciente</h3>
                        <div className="space-y-4">
                            {recentActivity.map((item: any, index: number) => (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                                    <div className={`p-3 rounded-full ${item.type === 'comunicado' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {item.type === 'comunicado' ? <BookOpen size={20} /> : <Calendar size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-gray-900">{item.titulo}</h4>
                                            <span className="text-xs text-gray-500">
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.descripcion}</p>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No hay actividad reciente.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, bgColor, iconColor }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

// Wrapper to use AreaChart lazily or just LineChart
const AreaChartWrapper = ({ data }: { data: any[] }) => (
    <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
        <Line
            type="monotone"
            dataKey="asistencia"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
        />
    </LineChart>
);

export default RectorDashboard;
