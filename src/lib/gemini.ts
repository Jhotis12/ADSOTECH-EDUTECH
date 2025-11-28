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
    children?: Array<{
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

        let contextPrompt = `Eres el asistente virtual de EduTech, una plataforma educativa. Estás hablando con:

Nombre: ${userContext.user.nombre} ${userContext.user.apellido}
Rol: ${getRoleName(userContext.user.rol)}
Correo: ${userContext.user.correo}
`;

        if (userContext.children && userContext.children.length > 0) {
            contextPrompt += `\nHijos/Estudiantes a cargo:\n`;
            userContext.children.forEach((child, index) => {
                contextPrompt += `\n${index + 1}. ${child.nombre} ${child.apellido} (${child.correo})\n`;

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
                        contextPrompt += `   - ${grade.asignatura}: ${grade.nota.toFixed(2)} (${grade.tipo}, ${new Date(grade.fecha).toLocaleDateString('es-CO')})\n`;
                    });
                }

                // Add recent attendance if available
                if (child.attendance && child.attendance.length > 0) {
                    contextPrompt += `   Asistencia Reciente:\n`;
                    child.attendance.slice(0, 5).forEach(att => {
                        contextPrompt += `   - ${new Date(att.fecha).toLocaleDateString('es-CO')}: ${att.estado}\n`;
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

        contextPrompt += `\nResponde de manera CONCISA y PROFESIONAL. IMPORTANTE:
- Responde ÚNICAMENTE lo que se te pregunta
- NO agregues información adicional no solicitada
- NO des explicaciones extra
- Sé directo y preciso
- Usa un tono profesional pero amigable
- Si te preguntan por un dato específico, da solo ese dato

Usuario pregunta: ${prompt}`;

        const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";

        const model = genAI.getGenerativeModel({
            model: modelName
        });

        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching Gemini response with context:", error);
        return "Lo siento, tuve un problema al procesar tu solicitud. Intenta de nuevo más tarde.";
    }
};
