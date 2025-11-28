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

    addHeader(doc, institution);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('CERTIFICADO DE ESTUDIO', pageWidth / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const text = `
    LA RECTORÍA DE LA INSTITUCIÓN EDUCATIVA ${institution.nombre.toUpperCase()}

    HACE CONSTAR:

    Que el(la) estudiante ${student.nombre.toUpperCase()} ${student.apellido.toUpperCase()}, se encuentra debidamente matriculado(a) en esta institución para el año lectivo en curso.

    El presente certificado se expide a solicitud del interesado(a) en ${institution.ciudad}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString('es-CO', { month: 'long' })} de ${new Date().getFullYear()}.
    `;

    doc.text(text, 20, 80, { maxWidth: pageWidth - 40, align: 'justify', lineHeightFactor: 1.5 });

    // Signature area
    doc.line(pageWidth / 2 - 40, 200, pageWidth / 2 + 40, 200);
    doc.text('RECTORÍA', pageWidth / 2, 205, { align: 'center' });

    addFooter(doc);
    doc.save(`Certificado_Estudio_${student.nombre}_${student.apellido}.pdf`);
};

export const generateStudyProof = (student: Student, institution: Institution) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    addHeader(doc, institution);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('CONSTANCIA DE ESTUDIO', pageWidth / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const text = `
    Por medio de la presente se hace constar que:

    ${student.nombre.toUpperCase()} ${student.apellido.toUpperCase()}

    Es estudiante activo de nuestra institución educativa.

    Se expide la presente constancia para los fines que el interesado estime convenientes.

    Dada en ${institution.ciudad}, el ${new Date().toLocaleDateString('es-CO')}.
    `;

    doc.text(text, 20, 80, { maxWidth: pageWidth - 40, align: 'justify', lineHeightFactor: 1.5 });

    // Signature area
    doc.line(pageWidth / 2 - 40, 180, pageWidth / 2 + 40, 180);
    doc.text('SECRETARÍA ACADÉMICA', pageWidth / 2, 185, { align: 'center' });

    addFooter(doc);
    doc.save(`Constancia_Estudio_${student.nombre}_${student.apellido}.pdf`);
};

export const generateAttendanceReport = (student: Student, institution: Institution, attendance: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    addHeader(doc, institution);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('REPORTE DE ASISTENCIA', pageWidth / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estudiante: ${student.nombre} ${student.apellido}`, 20, 75);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`, 20, 82);

    // Validate attendance array
    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
        doc.setFontSize(10);
        doc.text('No hay registros de asistencia disponibles.', 20, 100);
        addFooter(doc);
        doc.save(`Reporte_Asistencia_${student.nombre}_${student.apellido}.pdf`);
        return;
    }

    const tableData = attendance.map(a => [
        new Date(a.fecha).toLocaleDateString('es-CO'),
        a.estado
    ]);

    autoTable(doc, {
        startY: 90,
        head: [['Fecha', 'Estado']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] }, // Indigo color
        styles: { fontSize: 10 },
    });

    // Summary
    const total = attendance.length;
    const absences = attendance.filter(a => a.estado === 'Falta').length;
    const percentage = total > 0 ? Math.round(((total - absences) / total) * 100) : 0;

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text('Resumen:', 20, finalY);
    doc.text(`Total Clases: ${total}`, 30, finalY + 7);
    doc.text(`Total Inasistencias: ${absences}`, 30, finalY + 14);
    doc.text(`Porcentaje de Asistencia: ${percentage}%`, 30, finalY + 21);

    addFooter(doc);
    doc.save(`Reporte_Asistencia_${student.nombre}_${student.apellido}.pdf`);
};

export const generateGradesReport = (student: Student, institution: Institution, grades: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    addHeader(doc, institution);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('REPORTE DE CALIFICACIONES', pageWidth / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estudiante: ${student.nombre} ${student.apellido}`, 20, 75);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`, 20, 82);

    // Validate grades array
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
        doc.setFontSize(10);
        doc.text('No hay calificaciones registradas.', 20, 100);
        addFooter(doc);
        doc.save(`Reporte_Calificaciones_${student.nombre}_${student.apellido}.pdf`);
        return;
    }

    const tableData = grades.map(g => [
        g.asignatura,
        g.nota.toFixed(2),
        g.tipo,
        new Date(g.fecha).toLocaleDateString('es-CO')
    ]);

    autoTable(doc, {
        startY: 90,
        head: [['Asignatura', 'Nota', 'Tipo', 'Fecha']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] }, // Indigo color
        styles: { fontSize: 10 },
    });

    // Summary
    const totalGrades = grades.length;
    const average = totalGrades > 0
        ? grades.reduce((sum, g) => sum + g.nota, 0) / totalGrades
        : 0;

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text('Resumen Académico:', 20, finalY);
    doc.text(`Total Evaluaciones: ${totalGrades}`, 30, finalY + 7);
    doc.text(`Promedio General: ${average.toFixed(2)}`, 30, finalY + 14);

    addFooter(doc);
    doc.save(`Reporte_Calificaciones_${student.nombre}_${student.apellido}.pdf`);
};
