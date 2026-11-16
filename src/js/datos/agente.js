// Evaluaciones del agente de IA. Base: resultados-agente.json (lo genera `npm run agente`);
// si hay base de datos, se sobrescriben con lo guardado allí. La app solo LEE: el analista siempre decide.
import resultados from './resultados-agente.json';

const evaluaciones = { ...(resultados.evaluaciones ?? {}) };
const info = { generado: resultados.generado, modo: resultados.modo, modelo: resultados.modelo };

export const evaluacionDe = (id) => evaluaciones[id] ?? null;
export const infoAgente = () => ({ ...info });

/** Mezcla las evaluaciones guardadas en la base de datos con las locales. */
export function fusionarEvaluaciones(porCodigo) {
  Object.entries(porCodigo).forEach(([id, e]) => { evaluaciones[id] = { ...evaluaciones[id], ...e }; });
  const fechas = Object.values(porCodigo).map((e) => e.fecha).filter(Boolean).sort();
  if (fechas.length) { info.generado = fechas.at(-1); info.modo = Object.values(porCodigo)[0].modo; }
}

export const claseDePrioridad = (prioridad) => ({ Crítica: 'rojo', Alta: 'ambar', Media: 'gris', Baja: 'verde' }[prioridad] ?? 'gris');

/** Resumen para el panel: cuántos casos del listado quedaron en cada prioridad. */
export function conteoPorPrioridad(ids) {
  const cuenta = { Crítica: 0, Alta: 0, Media: 0, Baja: 0, sinEvaluar: 0 };
  ids.forEach((id) => {
    const e = evaluacionDe(id);
    if (e) cuenta[e.prioridad] += 1; else cuenta.sinEvaluar += 1;
  });
  return cuenta;
}

export function fechaLegible(iso) {
  return iso ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : 'sin ejecutar';
}
