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

    // Decorative border
    doc.setDrawColor(41, 128, 185); // Blue color
    doc.setLineWidth(1.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');

    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'S');

    // Header with institution name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(institution.nombre.toUpperCase(), pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`${institution.ciudad}, ${institution.departamento}`, pageWidth / 2, 31, { align: 'center' });
    doc.text(`NIT: ${institution.telefono}`, pageWidth / 2, 36, { align: 'center' });

    // Certificate title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('CERTIFICADO DE ESTUDIO', pageWidth / 2, 55, { align: 'center' });

    // Decorative line under title
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.8);
    doc.line(40, 58, pageWidth - 40, 58);

    // Certificate number
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    const certNumber = `No. ${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    doc.text(certNumber, pageWidth - 20, 65, { align: 'right' });

    // Main content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('LA RECTORÍA DE LA INSTITUCIÓN EDUCATIVA', pageWidth / 2, 80, { align: 'center' });
    doc.text(institution.nombre.toUpperCase(), pageWidth / 2, 88, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HACE CONSTAR:', pageWidth / 2, 105, { align: 'center' });

    // Student information box
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(25, 115, pageWidth - 50, 35, 'F');
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.rect(25, 115, pageWidth - 50, 35, 'S');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const documentInfo = student.tipodocumento && student.documento
        ? `identificado(a) con ${student.tipodocumento} No. ${student.documento}`
        : `identificado(a) con documento ${student.documento || 'N/A'}`;
    const studentText = `Que el(la) estudiante ${student.nombre.toUpperCase()} ${student.apellido.toUpperCase()}, ${documentInfo}, se encuentra debidamente matriculado(a) y cursando estudios en esta institución educativa para el año lectivo ${new Date().getFullYear()}.`;
    doc.text(studentText, 30, 125, { maxWidth: pageWidth - 60, align: 'justify', lineHeightFactor: 1.6 });

    // Additional text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const additionalText = `El presente certificado se expide a solicitud del interesado(a) para los fines que estime convenientes, en la ciudad de ${institution.ciudad}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString('es-CO', { month: 'long' })} de ${new Date().getFullYear()}.`;
    doc.text(additionalText, 25, 165, { maxWidth: pageWidth - 50, align: 'justify', lineHeightFactor: 1.5 });

    // Signature section
    const signatureY = 200;

    // Simulated signature (cursive-style text)
    doc.setFontSize(20);
    doc.setFont('times', 'italic');
    doc.setTextColor(0, 0, 139); // Dark blue for signature
    doc.text('Dr. [Nombre Rector]', pageWidth / 2, signatureY - 5, { align: 'center' });

    // Signature line
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 45, signatureY, pageWidth / 2 + 45, signatureY);

    // Title below signature
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('RECTOR(A)', pageWidth / 2, signatureY + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(institution.nombre, pageWidth / 2, signatureY + 11, { align: 'center' });

    // Official seal placeholder
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.circle(pageWidth - 35, signatureY - 10, 15, 'S');
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text('SELLO', pageWidth - 35, signatureY - 10, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Documento generado electrónicamente por EduTech Platform', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.setFontSize(7);
    doc.text(`Fecha de generación: ${new Date().toLocaleString('es-CO')}`, pageWidth / 2, pageHeight - 11, { align: 'center' });

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
