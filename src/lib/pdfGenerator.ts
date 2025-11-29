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

    // Simplified border
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.8);
    doc.rect(15, 15, pageWidth - 30, 100, 'S');

    // Header - more compact
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(institution.nombre.toUpperCase(), pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`${institution.ciudad}, ${institution.departamento}`, pageWidth / 2, 28, { align: 'center' });

    // Certificate title - reduced size
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('CERTIFICADO DE ESTUDIO', pageWidth / 2, 38, { align: 'center' });

    // Decorative line
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(50, 42, pageWidth - 50, 42);

    // Certificate number - smaller
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    const certNumber = `No. ${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    doc.text(certNumber, pageWidth - 20, 48, { align: 'right' });

    // Main content - more compact
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('LA RECTORÍA HACE CONSTAR:', pageWidth / 2, 58, { align: 'center' });

    // Student information - simplified
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const documentInfo = student.tipodocumento && student.documento
        ? `(${student.tipodocumento} ${student.documento})`
        : '';
    const studentText = `Que ${student.nombre.toUpperCase()} ${student.apellido.toUpperCase()} ${documentInfo} se encuentra matriculado(a) y cursando estudios en esta institución para el año lectivo ${new Date().getFullYear()}. Expedido en ${institution.ciudad}, ${new Date().toLocaleDateString('es-CO')}.`;
    doc.text(studentText, 25, 68, { maxWidth: pageWidth - 50, align: 'justify', lineHeightFactor: 1.4 });

    // Signature section - more compact
    const signatureY = 100;
    doc.setFontSize(14);
    doc.setFont('times', 'italic');
    doc.setTextColor(0, 0, 139);
    doc.text('Dr. [Nombre Rector]', pageWidth / 2, signatureY, { align: 'center' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 35, signatureY + 3, pageWidth / 2 + 35, signatureY + 3);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('RECTOR(A)', pageWidth / 2, signatureY + 8, { align: 'center' });

    // Simplified footer
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
