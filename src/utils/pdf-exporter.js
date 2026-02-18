import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

// Explicitly register the plugin
applyPlugin(jsPDF);

const THEME = {
    colors: {
        marble: '#F5F2EB',
        obsidian: '#1A1A2E',
        gold: '#C9A84C',
        terracotta: '#C4704B',
        aegean: '#3D5A80',
        olive: '#6B7F5E',
        white: '#FFFFFF',
        textSoft: '#2D2D44'
    },
    fonts: {
        heading: 'times',
        body: 'helvetica'
    }
};

export async function exportSessionPDF(session, toolsData) {
    if (!toolsData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = margin;

    // --- Header ---
    doc.setFont(THEME.fonts.heading, 'bold');
    doc.setFontSize(26);
    doc.setTextColor(THEME.colors.obsidian);
    doc.text('PAIDEIA', margin, y);

    // Subtitle / Greek branding
    doc.setFont(THEME.fonts.heading, 'italic');
    doc.setFontSize(12);
    doc.setTextColor(THEME.colors.gold);
    doc.text('Paideia · Formación Integral', margin, y + 6);

    y += 15;

    // Aesthetic Line
    doc.setDrawColor(THEME.colors.gold);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- Session Info ---
    doc.setFont(THEME.fonts.body, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(THEME.colors.aegean);
    doc.text('REPORTE DE SESIÓN', margin, y);
    y += 6;

    doc.setFont(THEME.fonts.heading, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(THEME.colors.obsidian);
    doc.text(session.topic || 'Sin título', margin, y);
    y += 8;

    doc.setFont(THEME.fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(THEME.colors.textSoft);

    const dateStr = new Date(session.createdAt).toLocaleDateString();
    doc.text(`Código: ${session.code}  |  Fecha: ${dateStr}`, margin, y);
    y += 15;

    // --- Tools Data ---
    const toolNames = {
        gnosis: 'Gnosis (Conocimiento Previo)',
        noesis: 'Noesis (Comprensión)',
        eikasia: 'Eikasia (Imaginación)',
        aporia: 'Aporia (Duda/Confusión)',
        logos: 'Logos (Palabra/Concepto)',
        methexis: 'Methexis (Conexión)',
        anamnesis: 'Anamnesis (Recuerdo)'
    };

    const toolKeys = ['gnosis', 'noesis', 'eikasia', 'aporia', 'logos', 'methexis', 'anamnesis'];

    toolKeys.forEach((key) => {
        const entries = toolsData[key];
        if (!entries) return; // Skip if no data

        // Check page break
        if (y > doc.internal.pageSize.height - 40) {
            doc.addPage();
            y = margin;
        }

        // Section Header
        doc.setFont(THEME.fonts.heading, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(THEME.colors.obsidian);
        doc.text(toolNames[key] || key.toUpperCase(), margin, y);
        y += 2;

        // Prepare table data based on tool type
        let head = [];
        let body = [];

        const entriesArray = Array.isArray(entries) ? entries : Object.values(entries);
        const getStudent = (e) => e.student || 'Anónimo';

        if (key === 'gnosis') {
            head = [['Estudiante', 'Fase', 'Valoración']];
            body = entriesArray.map(e => [
                getStudent(e),
                e.phase === 'before' ? 'Inicial' : 'Final',
                (e.value || '-') + '/5'
            ]);
        } else if (key === 'noesis') {
            head = [['Estudiante', '¿Entiende?']];
            body = entriesArray.map(e => [
                getStudent(e),
                e.answer === 'yes' ? 'Sí' : (e.answer === 'no' ? 'No' : 'Más o menos')
            ]);
        } else if (key === 'eikasia') {
            head = [['Estudiante', 'Hipótesis']];
            body = entriesArray.map(e => [getStudent(e), e.hypothesis || '-']);
        } else if (key === 'aporia') {
            const doubts = entriesArray.filter(e => e.type === 'doubt');
            if (doubts.length === 0) {
                // If no doubts, maybe show status summary? For now, skip table if empty or show empty message
                body = []; // Logic below handles empty body
            }
            head = [['Estudiante', 'Duda']];
            body = doubts.map(e => [getStudent(e), e.text || '-']);
        } else if (key === 'logos') {
            head = [['Estudiante', 'Palabra Clave']];
            body = entriesArray.map(e => [getStudent(e), e.word || '-']);
        } else if (key === 'methexis') {
            head = [['Estudiante', 'Concepto', 'Conexión', 'Razón']];
            body = entriesArray.map(e => [
                getStudent(e),
                e.concept || '-',
                e.connection || '-',
                e.reason || '-'
            ]);
        } else if (key === 'anamnesis') {
            head = [['Estudiante', 'Aprendió', 'Duda', 'Conexión']];
            body = entriesArray.map(e => [
                getStudent(e),
                e.learned || '-',
                e.wonder || '-',
                e.connected || '-'
            ]);
        }

        if (body.length > 0) {
            // Generate Table
            doc.autoTable({
                startY: y + 3,
                head: head,
                body: body,
                theme: 'grid',
                headStyles: {
                    fillColor: THEME.colors.aegean,
                    textColor: THEME.colors.white,
                    font: THEME.fonts.heading,
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: THEME.colors.obsidian,
                    font: THEME.fonts.body
                },
                alternateRowStyles: {
                    fillColor: THEME.colors.marble
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 4,
                    lineColor: THEME.colors.gold,
                    lineWidth: 0.1
                },
                margin: { left: margin, right: margin }
            });

            y = doc.lastAutoTable.finalY + 15;
        } else {
            // Optional: Draw text saying "No entries"
            doc.setFont(THEME.fonts.body, 'italic');
            doc.setFontSize(10);
            doc.setTextColor(THEME.colors.textSoft);
            doc.text('(Sin entradas registradas)', margin, y + 8);
            y += 15;
        }
    });

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount} — Generado por Paideia`, margin, doc.internal.pageSize.height - 10);

        // Footer Line
        doc.setDrawColor(THEME.colors.parchment || '#E8E0D0');
        doc.line(margin, doc.internal.pageSize.height - 15, pageWidth - margin, doc.internal.pageSize.height - 15);
    }

    doc.save(`Paideia_${session.code}.pdf`);
}
