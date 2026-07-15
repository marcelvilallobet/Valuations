/**
 * Generación del informe PDF con pdfmake.
 * Se importa dinámicamente solo cuando el usuario lo solicita
 * para no añadir peso en la carga inicial de la página.
 *
 * USO:
 *   const { generarPDF } = await import('./informe-pdf.js');
 *   await generarPDF(resultado, inputs, textos);
 */

/** Formatea un número como moneda española: 1.250.000 € */
function fmt(n) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

/** Formatea un porcentaje */
function fmtPct(n) {
  return `${(n * 100).toFixed(1)} %`;
}

/**
 * Genera y descarga el informe PDF de valoración.
 *
 * @param {object} resultado   — devuelto por calcularNivel1/2 o calcularDCF
 * @param {object} inputs      — datos que el usuario introdujo
 * @param {object} textos      — contenido de textos.json
 */
export async function generarPDF(resultado, inputs, textos) {
  // Carga diferida de pdfmake (no se incluye en el bundle inicial)
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
  const pdfMake = pdfMakeModule.default || pdfMakeModule;
  const pdfFonts = pdfFontsModule.default || pdfFontsModule;
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

  const hoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const marca = textos.marca.nombre;

  // ── Tabla de desglose según metodología ──────────────────────────────────
  let tablaDesglose = [];

  if (resultado.metodologia === 'multiplos-nivel1' || resultado.metodologia === 'multiplos-nivel2') {
    tablaDesglose = [
      [{ text: 'Parámetro', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
      ['Sector', resultado.sectorNombre],
      ['EBITDA utilizado', fmt(resultado.ebitdaEstimado ?? resultado.ebitdaUsado)],
      ['Múltiplo mínimo (sector)', `${resultado.multiplo_min}x`],
      ['Múltiplo máximo (sector)', `${resultado.multiplo_max}x`],
      ['Múltiplo central aplicado', `${resultado.multiplo_central}x`],
      ['Valoración mínima', fmt(resultado.valorMin)],
      ['Valoración central', fmt(resultado.valorCentral)],
      ['Valoración máxima', fmt(resultado.valorMax)],
    ];
    if (resultado.metodologia === 'multiplos-nivel1') {
      tablaDesglose.splice(3, 0, ['Margen EBITDA estimado (sector)', fmtPct(resultado.margenEbitdaUsado)]);
    }
    if (resultado.factorAntiguedad !== undefined) {
      tablaDesglose.push(['Factor antigüedad aplicado', fmtPct(resultado.factorAntiguedad)]);
    }
  } else if (resultado.metodologia === 'dcf-nivel3') {
    tablaDesglose = [
      [{ text: 'Parámetro', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
      ['Sector', resultado.sectorNombre],
      ['EBITDA actual', fmt(inputs.ebitda)],
      ['WACC mínimo (rango)', fmtPct(resultado.waccMin)],
      ['WACC máximo (rango)', fmtPct(resultado.waccMax)],
      ['WACC central utilizado', fmtPct(resultado.waccUsado)],
      ['Tasa crecimiento perpetuo (g)', fmtPct(resultado.gTerminal)],
      ['Valor Terminal (escenario central)', fmt(resultado.valorTerminalCentral)],
      ['Valoración mínima (WACC alto)', fmt(resultado.valorMin)],
      ['Valoración central', fmt(resultado.valorCentral)],
      ['Valoración máxima (WACC bajo)', fmt(resultado.valorMax)],
    ];
    // Añade la tabla de FCF proyectados
    tablaDesglose.push([{ text: 'Flujos de Caja proyectados (FCF)', colSpan: 2, style: 'tableSubHeader' }, {}]);
    resultado.flujos.forEach((fcf, i) => {
      tablaDesglose.push([`Año ${i + 1} (crecimiento ${fmtPct(resultado.tasasCrecimiento[i] ?? 0)})`, fmt(fcf)]);
    });
  } else if (resultado.metodologia === 'informe') {
    tablaDesglose = [
      [{ text: 'Parámetro', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
      ['Sector', resultado.sectorNombre],
      ['EBITDA utilizado', fmt(resultado.ebitda)],
      ['Margen EBITDA', fmtPct(resultado.margen)],
      ['Crecimiento anual', fmtPct(resultado.crecimiento)],
      ['WACC (DCF)', fmtPct(resultado.waccUsado)],
      ['Múltiplo EV/EBITDA aplicado', `${resultado.multiplo}x`],
      [{ text: 'Métodos (valoración · peso)', colSpan: 2, style: 'tableSubHeader' }, {}],
      ...resultado.metodos.map((m) => [`${m.nombre} · ${Math.round(m.peso * 100)} %`, fmt(m.valor)]),
      ['Valoración mínima', fmt(resultado.valorMin)],
      ['Valoración combinada', fmt(resultado.valorCentral)],
      ['Valoración máxima', fmt(resultado.valorMax)],
    ];
  }

  // ── Tabla comparativa de múltiplos por sector ─────────────────────────────
  const tablaSectores = [
    [
      { text: 'Sector', style: 'tableHeader' },
      { text: 'Múltiplo mín.', style: 'tableHeader' },
      { text: 'Múltiplo máx.', style: 'tableHeader' },
    ],
    ['Tecnología / SaaS', '8x', '14x'],
    ['Industria / Manufactura', '4x', '7x'],
    ['Retail / Comercio', '3x', '6x'],
    ['Servicios profesionales', '4x', '8x'],
    ['Hostelería / Restauración', '3x', '5x'],
    ['Salud / Clínicas', '6x', '10x'],
    ['Construcción', '3x', '6x'],
    ['Logística / Transporte', '4x', '7x'],
    ['Genérico / Otros', '4x', '7x'],
  ];

  // ── Definición del documento PDF ─────────────────────────────────────────
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [50, 60, 50, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 11,
      color: '#1a2b4a',
      lineHeight: 1.4,
    },
    styles: {
      title: { fontSize: 22, bold: true, color: '#1a2b4a', margin: [0, 0, 0, 6] },
      subtitle: { fontSize: 12, color: '#64748b', margin: [0, 0, 0, 20] },
      sectionTitle: { fontSize: 14, bold: true, color: '#1a2b4a', margin: [0, 20, 0, 8] },
      tableHeader: { bold: true, fillColor: '#1a2b4a', color: '#ffffff', fontSize: 10 },
      tableSubHeader: { bold: true, fillColor: '#e2e8f0', color: '#1a2b4a', fontSize: 10 },
      valorRange: { fontSize: 26, bold: true, color: '#2563eb', alignment: 'center' },
      disclaimer: { fontSize: 9, color: '#64748b', italics: true },
      footer: { fontSize: 8, color: '#94a3b8' },
    },
    header: (currentPage) => currentPage === 1 ? null : {
      text: `${marca} · Informe de Valoración Orientativa`,
      alignment: 'right',
      margin: [50, 20, 50, 0],
      style: 'footer',
    },
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: `Generado el ${hoy}`, style: 'footer', margin: [50, 0, 0, 0] },
        { text: `Página ${currentPage} de ${pageCount}`, style: 'footer', alignment: 'right', margin: [0, 0, 50, 0] },
      ],
      margin: [0, 10, 0, 0],
    }),
    content: [
      // Cabecera
      { text: marca, style: 'title' },
      { text: textos.informe_pdf.titulo, style: 'subtitle' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 2, lineColor: '#2563eb' }] },

      // Resultado principal
      { text: 'Valoración orientativa', style: 'sectionTitle' },
      {
        table: {
          widths: ['*'],
          body: [[
            {
              stack: [
                { text: 'Rango de valoración estimado:', fontSize: 11, color: '#64748b', alignment: 'center', margin: [0, 10, 0, 4] },
                { text: `${fmt(resultado.valorMin)} — ${fmt(resultado.valorMax)}`, style: 'valorRange' },
                { text: `Estimación central: ${fmt(resultado.valorCentral)}`, fontSize: 12, alignment: 'center', color: '#334155', margin: [0, 6, 0, 10] },
              ],
              fillColor: '#f8fafc',
              border: [true, true, true, true],
              borderColor: ['#2563eb', '#2563eb', '#2563eb', '#2563eb'],
            },
          ]],
        },
        margin: [0, 0, 0, 16],
      },

      // Nota rápida sobre deuda
      {
        text: '⚠ Este valor es el Enterprise Value (EV). Si tu empresa tiene deuda financiera neta, resta ese importe para obtener el valor del capital (equity value) que recibirías como propietario.',
        fontSize: 10,
        color: '#d97706',
        margin: [0, 0, 0, 16],
      },

      // Desglose del cálculo
      { text: 'Desglose del cálculo', style: 'sectionTitle' },
      {
        table: {
          widths: ['*', 'auto'],
          body: tablaDesglose,
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: () => '#e2e8f0',
          fillColor: (rowIndex) => rowIndex % 2 === 0 ? '#f8fafc' : null,
        },
        margin: [0, 0, 0, 20],
      },

      // Comparativa sectorial
      { text: 'Comparativa de múltiplos por sector', style: 'sectionTitle' },
      { text: 'Los múltiplos EV/EBITDA varían según el sector. Tu empresa pertenece al sector marcado en negrita.', fontSize: 10, color: '#64748b', margin: [0, 0, 0, 8] },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: tablaSectores.map(row => {
            if (Array.isArray(row) && row[0] === resultado.sectorNombre) {
              return row.map(cell => ({ text: typeof cell === 'string' ? cell : cell.text, bold: true, fillColor: '#dbeafe' }));
            }
            return row;
          }),
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: () => '#e2e8f0',
        },
        margin: [0, 0, 0, 20],
      },

      // Cómo defender la valoración
      { text: textos.informe_pdf.seccion_como_defender, style: 'sectionTitle', pageBreak: 'before' },
      {
        text: textos.informe_pdf.texto_como_defender,
        fontSize: 11,
        margin: [0, 0, 0, 20],
      },

      // Disclaimer
      { text: 'Aviso importante', style: 'sectionTitle' },
      {
        text: textos.disclaimer,
        style: 'disclaimer',
        margin: [0, 0, 0, 20],
      },
      {
        text: `Documento generado automáticamente por ${marca} el ${hoy}. No constituye asesoramiento financiero, fiscal ni legal.`,
        style: 'disclaimer',
      },
    ],
  };

  // Genera y descarga el PDF
  pdfMake.createPdf(docDefinition).download(`valoracion-empresa-${new Date().toISOString().slice(0, 10)}.pdf`);
}
