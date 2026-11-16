// Consulta avanzada (W-20): solo lectura. Ejecuta consultas SELECT sobre datos de ejemplo y exporta el resultado a CSV.
import { toast, anunciar } from '../nucleo/avisos.js';
import { claseRiesgo } from '../datos/datos.js';

const DECISIONES = ['Rechazado', 'Aprobado', 'Derivado'];
const DATOS = Array.from({ length: 24 }, (_, i) => ({
  caso: `RCL-${2060 - i}`, riesgo: ['Alto', 'Alto', 'Medio', 'Bajo'][i % 4], decision: DECISIONES[i % 3], fecha: `${String(1 + (i % 28)).padStart(2, '0')}/09`,
}));

export default function consultas(raiz) {
  const editor = raiz.querySelector('.editor-sql');
  const cuerpo = raiz.querySelector('tbody');
  const titulo = raiz.querySelector('.encabezado--resultados .subtitulo-seccion');

  function ejecutar() {
    const sql = editor.value.trim();
    // Prevención de errores: este módulo no modifica datos.
    if (!/^select\b/i.test(sql) || /\b(delete|drop|update|insert|alter|truncate)\b/i.test(sql)) {
      toast('Solo se permiten consultas de lectura (SELECT). No se modificó ningún dato.', 'error');
      editor.focus();
      return;
    }
    const filtro = /riesgo\s*=\s*'(\w+)'/i.exec(sql)?.[1];
    const filas = DATOS.filter((d) => !filtro || d.riesgo.toLowerCase() === filtro.toLowerCase());
    cuerpo.innerHTML = filas.slice(0, 8).map((d) =>
      `<tr><td>${d.caso}</td><td><span class="etiqueta etiqueta--${claseRiesgo(d.riesgo)}">${d.riesgo}</span></td><td>${d.decision}</td><td>${d.fecha}</td></tr>`).join('');
    titulo.textContent = `Resultados (${filas.length} filas)`;
    anunciar(`Consulta ejecutada: ${filas.length} filas.`);
  }

  raiz.querySelector('[data-ejecutar]').addEventListener('click', ejecutar);
  raiz.querySelector('[data-exportar]').addEventListener('click', () => {
    const csv = ['caso,riesgo,decision,fecha', ...[...cuerpo.rows].map((r) => [...r.cells].map((c) => c.textContent.trim()).join(','))].join('\n');
    const enlace = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: 'consulta.csv',
    });
    enlace.click();
    URL.revokeObjectURL(enlace.href);
    toast('Resultado exportado a consulta.csv', 'ok');
  });
  ejecutar();
}
