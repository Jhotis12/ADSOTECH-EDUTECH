
import React from 'react';
import { X, TrendingUp, Calendar, CheckSquare, Award } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import type { UserContext } from '../lib/gemini';

interface EducationalAnalysisDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    userContext: UserContext;
}

const EducationalAnalysisDashboard: React.FC<EducationalAnalysisDashboardProps> = ({ isOpen, onClose, userContext }) => {
    const [selectedStudentIndex, setSelectedStudentIndex] = React.useState(0);
    const [selectedPeriod, setSelectedPeriod] = React.useState<number | 'all'>('all');

    if (!isOpen) return null;

    // Determine which student data to show
    const children = userContext.children || [];
    const student = children[selectedStudentIndex];

    if (!student) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                    <p className="text-gray-600 mb-4">No se encontró información del estudiante para analizar.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Cerrar</button>
                </div>
            </div>
        );
    }

    // Prepare Data for Charts

    // 1. Grades Data - Group by subject and calculate average
    const filteredGrades = selectedPeriod === 'all'
        ? student.grades
        : student.grades?.filter(g => g.periodo === selectedPeriod);

    // Group grades by subject and calculate average
    const gradesBySubject = (filteredGrades || []).reduce((acc: any, grade) => {
        const subject = grade.asignatura;
        if (!acc[subject]) {
            acc[subject] = { total: 0, count: 0, subject };
        }
        acc[subject].total += grade.nota;
        acc[subject].count += 1;
        return acc;
    }, {});

    const gradesData = Object.values(gradesBySubject).map((item: any) => ({
        name: item.subject.length > 20 ? item.subject.substring(0, 18) + '...' : item.subject,
        nota: item.total / item.count,
        fullSubject: item.subject,
        count: item.count
    })).sort((a: any, b: any) => b.nota - a.nota); // Sort by grade descending

    // 2. Attendance Data
    const attendanceData = [
        { name: 'Asistencias', value: (student.attendance?.filter(a => ['Presente', 'Asistió', 'Asistio'].includes(a.estado)).length || 0) },
        { name: 'Inasistencias', value: (student.attendance?.filter(a => ['Ausente', 'Falta', 'Inasistencia'].includes(a.estado)).length || 0) }
    ];

    // 3. Tasks Data
    const filteredTasks = selectedPeriod === 'all'
        ? student.tasks
        : student.tasks?.filter(t => t.periodo === selectedPeriod);

    const tasksData = [
        { name: 'Entregadas', value: filteredTasks?.filter(t => t.estado === 'entregada' || t.estado === 'calificada').length || 0 },
        { name: 'Pendientes', value: filteredTasks?.filter(t => t.estado === 'pendiente').length || 0 },
        { name: 'Atrasadas', value: filteredTasks?.filter(t => t.estado === 'atrasada').length || 0 }
    ];

    // Calculate stats based on filtered data
    const totalEvaluaciones = filteredGrades?.length || 0;
    const promedioGeneral = totalEvaluaciones > 0
        ? (filteredGrades || []).reduce((sum, g) => sum + g.nota, 0) / totalEvaluaciones
        : 0;

    const tareasEntregadas = filteredTasks?.filter(t => t.estado === 'entregada' || t.estado === 'calificada').length || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
            <div className="bg-gray-50 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Análisis Educativo</h2>
                            {children.length > 1 ? (
                                <select
                                    value={selectedStudentIndex}
                                    onChange={(e) => setSelectedStudentIndex(Number(e.target.value))}
                                    className="mt-1 block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {children.map((child, index) => (
                                        <option key={index} value={index}>
                                            {child.nombre} {child.apellido}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    {student.nombre} {student.apellido}
                                </p>
                            )}
                        </div>
                        <div className="ml-4">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="all">Todos los Periodos</option>
                                <option value={1}>Periodo 1</option>
                                <option value={2}>Periodo 2</option>
                                <option value={3}>Periodo 3</option>
                                <option value={4}>Periodo 4</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Promedio General</p>
                                <p className="text-2xl font-bold text-gray-800">{promedioGeneral.toFixed(1)}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Asistencia</p>
                                <p className="text-2xl font-bold text-gray-800">{student.stats?.porcentajeAsistencia}%</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <CheckSquare size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Tareas Entregadas</p>
                                <p className="text-2xl font-bold text-gray-800">{tareasEntregadas}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Evaluaciones</p>
                                <p className="text-2xl font-bold text-gray-800">{totalEvaluaciones}</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Grades Chart */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Award size={20} className="text-indigo-500" />
                                Promedio por Asignatura
                            </h3>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gradesData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 11 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} domain={[0, 5]} />
                                        <Tooltip
                                            cursor={{ fill: '#F3F4F6' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                                            <p className="font-semibold text-gray-800">{data.fullSubject}</p>
                                                            <p className="text-indigo-600 font-bold text-lg">{data.nota.toFixed(2)}</p>
                                                            <p className="text-xs text-gray-500">{data.count} evaluación(es)</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="nota" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Attendance Chart */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Calendar size={20} className="text-green-500" />
                                Resumen de Asistencia
                            </h3>
                            <div className="h-[250px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={attendanceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell key="cell-0" fill="#10B981" />
                                            <Cell key="cell-1" fill="#EF4444" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tasks Chart */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <CheckSquare size={20} className="text-purple-500" />
                                Estado de Tareas
                            </h3>
                            <div className="h-[250px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={tasksData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell key="cell-0" fill="#10B981" /> {/* Entregadas */}
                                            <Cell key="cell-1" fill="#F59E0B" /> {/* Pendientes */}
                                            <Cell key="cell-2" fill="#EF4444" /> {/* Atrasadas */}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationalAnalysisDashboard;
