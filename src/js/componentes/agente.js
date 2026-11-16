// Tarjeta «Agente Wayz»: muestra lo que el agente de IA dejó preparado para un caso.
// Se deja claro que es una SUGERENCIA (el analista decide) y cómo llegó a ella (transparencia).
import '../../styles/agente.css';
import { evaluacionDe, claseDePrioridad, infoAgente, fechaLegible } from '../datos/agente.js';
import { esc } from '../nucleo/dom.js';

const MODO = { gemini: 'Gemini', reglas: 'reglas del sistema' };

export function insigniaAgente(id) {
  const e = evaluacionDe(id);
  if (!e) return '<span class="etiqueta etiqueta--gris">Sin evaluar</span>';
  return `<span class="etiqueta etiqueta--${claseDePrioridad(e.prioridad)}" title="${esc(e.resumen)}">${e.prioridad} · ${e.puntaje}</span>`;
}

export function tarjetaAgente(id) {
  const e = evaluacionDe(id);
  if (!e) {
    return `<section class="tarjeta agente" aria-labelledby="ag-t">
      <h2 id="ag-t">Evaluación del agente</h2>
      <p>El agente todavía no evaluó este reclamo. Se ejecuta con <code>npm run agente</code>.</p></section>`;
  }
  const motivos = e.motivos.map((m) => `<li>${esc(m)}</li>`).join('');
  return `
    <section class="tarjeta agente agente--${claseDePrioridad(e.prioridad)}" aria-labelledby="ag-t">
      <div class="agente__cabecera">
        <h2 id="ag-t">Evaluación del agente</h2>
        <span class="etiqueta etiqueta--${claseDePrioridad(e.prioridad)}">Prioridad ${e.prioridad.toLowerCase()} · ${e.puntaje}/100</span>
      </div>
      <p class="agente__resumen">${esc(e.resumen)}</p>
      ${motivos ? `<h3>Por qué</h3><ul class="agente__motivos">${motivos}</ul>` : ''}
      <p class="agente__accion"><strong>Siguiente paso sugerido:</strong> ${esc(e.accion)}</p>
      <p class="agente__pie">Sugerencia automática, no es una decisión. Herramientas usadas: ${e.herramientas.join(', ')}.
        Cerebro: ${MODO[e.modo] ?? e.modo}${e.modelo ? ` (${esc(e.modelo)})` : ''}. Evaluado el ${fechaLegible(e.fecha)}.</p>
    </section>`;
}

export function textoDeEstado() {
  const i = infoAgente();
  return `Última revisión del agente: ${fechaLegible(i.generado)} · cerebro: ${MODO[i.modo] ?? i.modo ?? '—'}`;
}
