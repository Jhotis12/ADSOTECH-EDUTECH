import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

interface Institution {
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
    ciudad: string;
    departamento: string;
}

interface Student {
    nombre: string;
    apellido: string;
    tipodocumento?: string;
    documento?: string;
    grado?: string;
}

const addHeader = (doc: jsPDF, institution: Institution) => {
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(institution.nombre.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(institution.direccion, pageWidth / 2, 26, { align: 'center' });
    doc.text(`${institution.ciudad}, ${institution.departamento}`, pageWidth / 2, 31, { align: 'center' });
    doc.text(`Tel: ${institution.telefono} | Email: ${institution.correo}`, pageWidth / 2, 36, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(20, 40, pageWidth - 20, 40);
};

const addFooter = (doc: jsPDF) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Generado automáticamente por EduTech Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(new Date().toLocaleString('es-CO'), pageWidth - 20, pageHeight - 10, { align: 'right' });
};

export const generateStudyCertificate = (student: Student, institution: Institution) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Full page border
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');

    // Inner decorative border
    doc.setLineWidth(0.5);
    doc.rect(18, 18, pageWidth - 36, pageHeight - 36, 'S');

    // Header
    let currentY = 40;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(institution.nombre.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });

    currentY += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`${institution.ciudad}, ${institution.departamento}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    doc.text(`NIT: ${institution.telefono} | Email: ${institution.correo}`, pageWidth / 2, currentY, { align: 'center' });

    // Certificate title
    currentY += 30;
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('CERTIFICADO DE ESTUDIO', pageWidth / 2, currentY, { align: 'center' });

    // Decorative line
    currentY += 5;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(40, currentY, pageWidth - 40, currentY);

    // Certificate number
    currentY += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    const certNumber = `No. ${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    doc.text(certNumber, pageWidth - 25, currentY, { align: 'right' });

    // Main content header
    currentY += 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('LA RECTORÍA HACE CONSTAR:', pageWidth / 2, currentY, { align: 'center' });

    // Student information
    currentY += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const documentInfo = student.tipodocumento && student.documento
        ? `identificado(a) con ${student.tipodocumento} No. ${student.documento}`
        : `identificado(a) con documento ${student.documento || 'N/A'}`;

    const studentText = `Que el(la) estudiante ${student.nombre.toUpperCase()} ${student.apellido.toUpperCase()}, ${documentInfo}, se encuentra debidamente matriculado(a) en el grado ${student.grado || '____'} de esta Institución Educativa, y asiste regularmente a las actividades académicas programadas para el año lectivo ${new Date().getFullYear()}.

Durante su permanencia en la institución, ha observado buena conducta y cumplimiento con sus deberes académicos.

Se expide la presente certificación a solicitud del interesado(a) en ${institution.ciudad}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString('es-CO', { month: 'long' })} de ${new Date().getFullYear()}.`;

    doc.text(studentText, 30, currentY, { maxWidth: pageWidth - 60, align: 'justify', lineHeightFactor: 1.8 });

    // Signature section
    const signatureY = pageHeight - 60;
    doc.setFontSize(14);
    doc.setFont('times', 'italic');
    doc.setTextColor(0, 0, 139);
    doc.text('Dr. [Nombre Rector]', pageWidth / 2, signatureY - 5, { align: 'center' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, signatureY, pageWidth / 2 + 40, signatureY);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('RECTOR(A)', pageWidth / 2, signatureY + 6, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(institution.nombre, pageWidth / 2, signatureY + 12, { align: 'center' });

    // Footer
    addFooter(doc);
    doc.save(`Certificado_Estudio_${student.nombre}_${student.apellido}.pdf`);
};

export const generateStudyProof = (student: Student, institution: Institution) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    addHeader(doc, institution);

    // Reduced title size
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('CONSTANCIA DE ESTUDIO', pageWidth / 2, 52, { align: 'center' });

    // More concise content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const text = `Se hace constar que ${student.nombre.toUpperCase()} ${student.apellido.toUpperCase()} es estudiante activo de nuestra institución educativa. Se expide en ${institution.ciudad}, el ${new Date().toLocaleDateString('es-CO')}.`;

    doc.text(text, 20, 65, { maxWidth: pageWidth - 40, align: 'justify', lineHeightFactor: 1.3 });

    // Compact signature area
    doc.line(pageWidth / 2 - 35, 95, pageWidth / 2 + 35, 95);
    doc.setFontSize(9);
    doc.text('SECRETARÍA ACADÉMICA', pageWidth / 2, 100, { align: 'center' });

    addFooter(doc);
    doc.save(`Constancia_Estudio_${student.nombre}_${student.apellido}.pdf`);
};

export const generateAttendanceReport = (student: Student, institution: Institution, attendance: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    addHeader(doc, institution);

    // Reduced title and info sizes
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('REPORTE DE ASISTENCIA', pageWidth / 2, 52, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estudiante: ${student.nombre} ${student.apellido} | ${new Date().toLocaleDateString('es-CO')}`, 20, 60);

    // Validate attendance array
    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
        doc.setFontSize(9);
        doc.text('No hay registros de asistencia disponibles.', 20, 70);
        addFooter(doc);
        doc.save(`Reporte_Asistencia_${student.nombre}_${student.apellido}.pdf`);
        return;
    }

    // Calculate summary first
    const total = attendance.length;
    const absences = attendance.filter(a => a.estado === 'Ausente').length;
    const percentage = total > 0 ? Math.round(((total - absences) / total) * 100) : 0;

    // Show summary before table
    doc.setFontSize(9);
    doc.text(`Total: ${total} | Faltas: ${absences} | Asistencia: ${percentage}%`, 20, 67);

    // Limit attendance records to most recent 40 entries to fit in 3 pages
    const limitedAttendance = attendance.slice(-40);
    const tableData = limitedAttendance.map(a => [
        new Date(a.fecha).toLocaleDateString('es-CO'),
        a.estado
    ]);

    autoTable(doc, {
        startY: 72,
        head: [['Fecha', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181], fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 2 },
        margin: { left: 20, right: 20 },
    });

    if (attendance.length > 40) {
        const finalY = (doc as any).lastAutoTable.finalY + 5;
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text(`Mostrando los últimos 40 de ${attendance.length} registros`, 20, finalY);
    }

    addFooter(doc);
    doc.save(`Reporte_Asistencia_${student.nombre}_${student.apellido}.pdf`);
};

export const generateGradesReport = (student: Student, institution: Institution, grades: any[], period?: number) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    addHeader(doc, institution);

    // Reduced title size
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('REPORTE DE CALIFICACIONES', pageWidth / 2, 52, { align: 'center' });

    // More compact header info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const periodText = period ? ` - Periodo ${period}` : '';
    doc.text(`Estudiante: ${student.nombre} ${student.apellido}${periodText} | ${new Date().toLocaleDateString('es-CO')}`, 20, 60);

    // Filter grades ONLY by period (removed subject filter as per user request)
    let filteredGrades = grades;
    if (period) {
        filteredGrades = filteredGrades.filter(g => g.periodo === period);
    }

    // Validate grades array
    if (!filteredGrades || !Array.isArray(filteredGrades) || filteredGrades.length === 0) {
        doc.setFontSize(9);
        doc.text('No hay calificaciones registradas.', 20, 70);
        addFooter(doc);
        doc.save(`Reporte_Calificaciones_${student.nombre}_${student.apellido}.pdf`);
        return;
    }

    // Calculate summary
    const totalGrades = filteredGrades.length;
    const average = totalGrades > 0
        ? filteredGrades.reduce((sum, g) => sum + g.nota, 0) / totalGrades
        : 0;

    // Show summary before table
    doc.text(`Total Evaluaciones: ${totalGrades} | Promedio: ${average.toFixed(2)}`, 20, 67);

    // Group grades by subject and show only latest or average per subject to reduce length
    const gradesBySubject = new Map<string, any[]>();
    filteredGrades.forEach(g => {
        if (!gradesBySubject.has(g.asignatura)) {
            gradesBySubject.set(g.asignatura, []);
        }
        gradesBySubject.get(g.asignatura)!.push(g);
    });

    const tableData: any[] = [];
    gradesBySubject.forEach((subjectGrades, asignatura) => {
        const avg = subjectGrades.reduce((sum, g) => sum + g.nota, 0) / subjectGrades.length;
        const count = subjectGrades.length;
        tableData.push([
            asignatura,
            avg.toFixed(2),
            `${count} eval.`,
            subjectGrades[subjectGrades.length - 1].tipo
        ]);
    });

    autoTable(doc, {
        startY: 72,
        head: [['Asignatura', 'Promedio', 'Cantidad', 'Último Tipo']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181], fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 2 },
        margin: { left: 20, right: 20 },
    });

    addFooter(doc);
    doc.save(`Reporte_Calificaciones_${student.nombre}_${student.apellido}.pdf`);
};
