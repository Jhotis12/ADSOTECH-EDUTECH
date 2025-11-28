import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the API only if the key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface UserContext {
    user: {
        nombre: string;
        apellido: string;
        rol: string;
        correo: string;
    };
    institution?: {
        nombre: string;
        direccion: string;
        telefono: string;
        correo: string;
        tipo: string;
        ciudad: string;
        departamento: string;
    };
    teachers?: Array<{
        nombre: string;
        apellido: string;
        correo: string;
        asignaturas: string[];
    }>;
    schedules?: Array<{
        asignatura: string;
        docente: string;
        diasemana: string;
        horainicio: string;
        horafin: string;
        grupo: string;
    }>;
    events?: Array<{
        titulo: string;
        descripcion: string;
        fechainicio: string;
        fechafin: string;
        tipo: string;
    }>;
    announcements?: Array<{
        titulo: string;
        mensaje: string;
        fecha: string;
        dirigidoa: string;
    }>;
    children?: Array<{
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
            estado: string; // 'pendiente', 'entregada', 'calificada', 'atrasada'
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
    }>;
}

export const getGeminiResponse = async (prompt: string): Promise<string> => {
    if (!genAI) {
        return "Error: La API Key de Gemini no está configurada. Por favor revisa el archivo .env.";
    }

    try {
        const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";
        const systemInstruction = import.meta.env.VITE_SYSTEM_PROMPT;

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        return "Lo siento, tuve un problema al procesar tu solicitud. Intenta de nuevo más tarde.";
    }
};

export const getGeminiResponseWithContext = async (
    prompt: string,
    userContext: UserContext
): Promise<string> => {
    if (!genAI) {
        return "Error: La API Key de Gemini no está configurada. Por favor revisa el archivo .env.";
    }

    try {
        const getRoleName = (rol: string): string => {
            const roles: { [key: string]: string } = {
                '1': 'Administrador',
                '2': 'Rector',
                '3': 'Docente',
                '4': 'Estudiante',
                '5': 'Padre/Acudiente',
                '6': 'Secretaría'
            };
            return roles[rol] || 'Usuario';
        };

        let contextPrompt = `
Eres un asistente virtual útil y amable para la plataforma educativa EduTech.
${userContext.user.rol === '4'
                ? "Estás hablando directamente con el ESTUDIANTE. Responde usando 'tú', 'tus notas', 'tu promedio'. NO hables de 'hijos'."
                : "Estás hablando con un PADRE/ACUDIENTE. Responde refiriéndote a 'su hijo', 'sus notas', 'el estudiante'."}

Información del Usuario:
Nombre: ${userContext.user.nombre} ${userContext.user.apellido}
Rol: ${getRoleName(userContext.user.rol)}
Correo: ${userContext.user.correo}
`;

        if (userContext.children && userContext.children.length > 0) {
            contextPrompt += userContext.user.rol === '4'
                ? `\nTu Información Académica (Estudiante):\n`
                : `\nHijos/Estudiantes a cargo:\n`;

            userContext.children.forEach((child, index) => {
                const docInfo = child.tipodocumento && child.documento
                    ? ` - ${child.tipodocumento}: ${child.documento}`
                    : child.documento
                        ? ` - Documento: ${child.documento}`
                        : '';
                contextPrompt += `\n${index + 1}. ${child.nombre} ${child.apellido} (${child.correo})${docInfo}\n`;

                // Add statistics if available
                if (child.stats) {
                    contextPrompt += `   Estadísticas Académicas:\n`;
                    contextPrompt += `   - Promedio General: ${child.stats.promedioGeneral.toFixed(2)}\n`;
                    contextPrompt += `   - Asistencia: ${child.stats.porcentajeAsistencia}% (${child.stats.totalInasistencias} inasistencias)\n`;
                    contextPrompt += `   - Total Evaluaciones: ${child.stats.totalEvaluaciones}\n`;
                }

                // Add recent grades if available
                if (child.grades && child.grades.length > 0) {
                    contextPrompt += `   Calificaciones Recientes:\n`;
                    child.grades.slice(0, 10).forEach(grade => {
                        contextPrompt += `   - ${grade.asignatura}: ${grade.nota.toFixed(2)} (${grade.tipo}, Periodo ${grade.periodo || 'N/A'}, ${new Date(grade.fecha).toLocaleDateString('es-CO')})\n`;
                    });
                }

                // Add recent attendance if available
                if (child.attendance && child.attendance.length > 0) {
                    contextPrompt += `   Asistencia Reciente:\n`;
                    child.attendance.slice(0, 5).forEach(att => {
                        contextPrompt += `   - ${new Date(att.fecha).toLocaleDateString('es-CO')}: ${att.estado}\n`;
                    });
                }

                // Add tasks if available
                if (child.tasks && child.tasks.length > 0) {
                    contextPrompt += `   Tareas Asignadas:\n`;

                    // Show task statistics
                    if (child.taskStats) {
                        contextPrompt += `   Estadísticas de Tareas:\n`;
                        contextPrompt += `   - Total: ${child.taskStats.totalTareas}\n`;
                        contextPrompt += `   - Entregadas: ${child.taskStats.tareasEntregadas}\n`;
                        contextPrompt += `   - Pendientes: ${child.taskStats.tareasPendientes}\n`;
                        contextPrompt += `   - Atrasadas: ${child.taskStats.tareasAtrasadas}\n`;
                        contextPrompt += `   - Calificadas: ${child.taskStats.tareasCalificadas}\n`;
                    }

                    // Show recent/upcoming tasks
                    child.tasks.slice(0, 10).forEach(task => {
                        const status = task.estado === 'atrasada' ? '⚠️ ATRASADA' :
                            task.estado === 'entregada' ? '✓ Entregada' :
                                task.estado === 'calificada' ? `✓ Calificada (${task.nota})` :
                                    '⏳ Pendiente';
                        contextPrompt += `   - ${task.asignatura}: ${task.titulo} (Periodo ${task.periodo || 'N/A'}) - ${status}\n`;
                        contextPrompt += `     Entrega: ${new Date(task.fechaentrega).toLocaleDateString('es-CO')}\n`;
                        if (task.descripcion) {
                            contextPrompt += `     Descripción: ${task.descripcion}\n`;
                        }
                    });
                }
            });
        }

        // Add institution information
        if (userContext.institution) {
            contextPrompt += `\nInformación de la Institución:\n`;
            contextPrompt += `- Nombre: ${userContext.institution.nombre}\n`;
            contextPrompt += `- Dirección: ${userContext.institution.direccion}\n`;
            contextPrompt += `- Ciudad: ${userContext.institution.ciudad}, ${userContext.institution.departamento}\n`;
            contextPrompt += `- Teléfono: ${userContext.institution.telefono}\n`;
            contextPrompt += `- Correo: ${userContext.institution.correo}\n`;
            contextPrompt += `- Tipo: ${userContext.institution.tipo}\n`;
        }

        // Add teachers information
        if (userContext.teachers && userContext.teachers.length > 0) {
            contextPrompt += `\nProfesores de la Institución:\n`;
            userContext.teachers.forEach((teacher, index) => {
                contextPrompt += `${index + 1}. ${teacher.nombre} ${teacher.apellido} (${teacher.correo})\n`;
                if (teacher.asignaturas && teacher.asignaturas.length > 0) {
                    contextPrompt += `   Asignaturas: ${teacher.asignaturas.join(', ')}\n`;
                }
            });
        }

        // Add schedules information
        if (userContext.schedules && userContext.schedules.length > 0) {
            contextPrompt += `\nHorarios de Clases:\n`;
            userContext.schedules.forEach((schedule, index) => {
                contextPrompt += `${index + 1}. ${schedule.asignatura} - ${schedule.docente}\n`;
                contextPrompt += `   Día: ${schedule.diasemana}, Hora: ${schedule.horainicio} - ${schedule.horafin}\n`;
                contextPrompt += `   Grupo: ${schedule.grupo}\n`;
            });
        }

        // Add events information
        if (userContext.events && userContext.events.length > 0) {
            contextPrompt += `\nEventos y Reuniones (Recientes y Próximos):\n`;
            userContext.events.forEach((event, index) => {
                contextPrompt += `${index + 1}. ${event.titulo} (${event.tipo})\n`;
                contextPrompt += `   Descripción: ${event.descripcion}\n`;
                contextPrompt += `   Fecha: ${new Date(event.fechainicio).toLocaleString('es-CO')}`;
                if (event.fechafin && event.fechafin !== event.fechainicio) {
                    contextPrompt += ` - ${new Date(event.fechafin).toLocaleString('es-CO')}`;
                }
                contextPrompt += `\n`;
            });
        }

        // Add announcements
        if (userContext.announcements && userContext.announcements.length > 0) {
            contextPrompt += `\nComunicados Institucionales:\n`;
            userContext.announcements.forEach((announcement, index) => {
                contextPrompt += `${index + 1}. ${announcement.titulo} (${new Date(announcement.fecha).toLocaleDateString('es-CO')})\n`;
                contextPrompt += `   Mensaje: ${announcement.mensaje}\n`;
                contextPrompt += `   Dirigido a: ${announcement.dirigidoa}\n`;
            });
        }

        contextPrompt += `\nResponde de manera CONCISA y PROFESIONAL. IMPORTANTE:
- Responde ÚNICAMENTE lo que se te pregunta
- NO agregues información adicional no solicitada
- NO des explicaciones extra
- Sé directo y preciso
- Usa un tono profesional pero amigable

SI EL USUARIO PIDE UN CERTIFICADO O REPORTE:
1. Identifica qué tipo de documento quiere:
   - "CERTIFICADO_ESTUDIO" (Certificado formal)
   - "CONSTANCIA_ESTUDIO" (Constancia simple)
   - "REPORTE_ASISTENCIA" (Reporte de fallas/asistencia)
   - "REPORTE_CALIFICACIONES" (Reporte de notas/calificaciones)
2. Identifica para qué estudiante es:
   - Si el usuario tiene UN SOLO hijo/estudiante a cargo (o es el estudiante mismo), ASUME que es para él.
   - Si tiene VARIOS hijos y no especificó el nombre, PREGUNTA "¿Para cuál de tus hijos necesitas el certificado?".
3. Si ya sabes el estudiante y el tipo:
   - PRIMERO: Genera una respuesta verbal confirmando la acción (ej: "Claro, estoy generando tu reporte...").
   - SEGUNDO: Incluye el marcador de acción AL FINAL.
   - TERCERO: Si el usuario especifica un PERIODO (ej: "del primer periodo", "periodo 2"), inclúyelo en el JSON como "period" (número).

   Formato: "Mensaje verbal. <<<ACTION:{"type":"TIPO_DOCUMENTO", "studentName":"NOMBRE_ESTUDIANTE", "period": NUMERO_OPCIONAL}>>>"

Ejemplo: "Claro, aquí tienes el reporte de Juan del periodo 1. <<<ACTION:{"type":"REPORTE_CALIFICACIONES", "studentName":"Juan Pérez", "period": 1}>>>"

Usuario pregunta: ${prompt}`;

        const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";

        const model = genAI.getGenerativeModel({
            model: modelName
        });

        // Retry logic for 429 errors
        let retries = 3;
        let delay = 2000; // Start with 2 seconds

        while (retries > 0) {
            try {
                const result = await model.generateContent(contextPrompt);
                const response = await result.response;
                return response.text();
            } catch (error: any) {
                if (error.message?.includes('429') || error.status === 429 || error.toString().includes('429')) {
                    retries--;
                    if (retries === 0) throw error;
                    console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                } else {
                    throw error;
                }
            }
        }
        return "Lo siento, el servicio está saturado en este momento. Por favor intenta de nuevo en unos segundos.";
    } catch (error) {
        console.error("Error fetching Gemini response with context:", error);
        return "Lo siento, tuve un problema al procesar tu solicitud. Intenta de nuevo más tarde.";
    }
};
