import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

// Explicitly register the plugin
applyPlugin(jsPDF);

export async function exportSessionPDF(session, toolsData) {
    if (!toolsData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let y = margin;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Paideia Blue
    doc.text('PAIDEIA', margin, y);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Formación Integral', margin + 35, y);

    y += 10;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- Session Info ---
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Tema: ${session.topic}`, margin, y);
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Código: ${session.code}`, margin, y);
    doc.text(`Fecha: ${new Date(session.createdAt).toLocaleDateString()}`, margin + 50, y);
    y += 15;

    // --- Tools Data ---
    const toolNames = {
        gnosis: 'Gnosis (Conocimiento Previo)',
        noesis: 'Noesis (Comprensión)',
        eikasia: 'Eikasia (Imaginación/Hipótesis)',
        aporia: 'Aporia (Duda/Confusión)',
        logos: 'Logos (Palabra/Concepto)',
        methexis: 'Methexis (Conexión)',
        anamnesis: 'Anamnesis (Recuerdo/Cierre)'
    };

    const toolKeys = ['gnosis', 'noesis', 'eikasia', 'aporia', 'logos', 'methexis', 'anamnesis'];

    toolKeys.forEach((key) => {
        const entries = toolsData[key];
        if (!entries) return; // Skip if no data

        // Check if we need a new page
        if (y > doc.internal.pageSize.height - 40) {
            doc.addPage();
            y = margin;
        }

        // Tool Header
        doc.setFontSize(14);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'bold');
        doc.text(toolNames[key] || key.toUpperCase(), margin, y);
        y += 2;
        doc.setFont('helvetica', 'normal');

        // Prepare table data based on tool type
        let head = [];
        let body = [];

        const entriesArray = Array.isArray(entries) ? entries : Object.values(entries);

        if (key === 'gnosis') {
            head = [['Estudiante', 'Respuesta']];
            body = entriesArray.map(e => [e.student, e.answer]);
        } else if (key === 'noesis') {
            head = [['Estudiante', '¿Entiende?']];
            body = entriesArray.map(e => [e.student, e.answer === 'yes' ? 'Sí' : (e.answer === 'no' ? 'No' : 'Más o menos')]);
        } else if (key === 'eikasia') {
            head = [['Estudiante', 'Hipótesis']];
            body = entriesArray.map(e => [e.student, e.content]);
        } else if (key === 'aporia') {
            head = [['Estudiante', 'Duda']];
            body = entriesArray.map(e => [e.student, e.content]);
        } else if (key === 'logos') {
            head = [['Estudiante', 'Palabra Clave']];
            body = entriesArray.map(e => [e.student, e.content]);
        } else if (key === 'methexis') {
            head = [['Estudiante', 'Concepto', 'Conexión', 'Razón']];
            body = entriesArray.map(e => [e.student, e.concept, e.connection, e.reason]);
        } else if (key === 'anamnesis') {
            head = [['Estudiante', 'Aprendió', 'Duda', 'Conexión']];
            body = entriesArray.map(e => [e.student, e.learned, e.wonder, e.connection]);
        }

        // Generate Table
        doc.autoTable({
            startY: y + 3,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: 50 },
            styles: { fontSize: 9, cellPadding: 3 },
            margin: { left: margin, right: margin }
        });

        // Use lastAutoTable from doc instance
        y = doc.lastAutoTable.finalY + 15;
    });

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount} — Generado por Paideia`, margin, doc.internal.pageSize.height - 10);
    }

    doc.save(`Paideia_${session.code}.pdf`);
}
