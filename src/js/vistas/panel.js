// Vista: Panel del analista (wireframe W-03). Los indicadores y la tabla salen de los datos, no están escritos a mano.
import '../../styles/vistas/panel.css';
import '../../styles/vistas/panel-extra.css';
import { CASOS, NOTIFICACIONES, claseRiesgo } from '../datos/datos.js';
import { trabajo } from '../nucleo/almacen.js';
import { esc } from '../nucleo/dom.js';
import { insigniaAgente, textoDeEstado } from '../componentes/agente.js';
import { conteoPorPrioridad } from '../datos/agente.js';

const ORDEN = { Alto: 0, Medio: 1, Bajo: 2 };

export const casosDelAnalista = () =>
  [...trabajo.casosNuevos, ...CASOS].sort((a, b) => ORDEN[a.riesgo] - ORDEN[b.riesgo] || a.plazo - b.plazo);

export default {
  render: () => {
    const casos = casosDelAnalista();
    const kpi = (nombre, valor, ayuda) => `<div class="kpi" role="listitem"><span>${nombre}</span><strong>${valor}</strong><small>${ayuda}</small></div>`;
    const filas = casos.map((c, i) => `
      <tr class="${i === 0 ? 'seleccionada' : ''}">
        <td><label class="selector"><input type="radio" name="caso" value="${esc(c.id)}" ${i === 0 ? 'checked' : ''} aria-label="Seleccionar ${esc(c.id)}"> <a href="#/expediente/${esc(c.id)}/resumen"><b>${esc(c.id)}</b></a></label></td>
        <td>${esc(c.tipo)}</td>
        <td><span class="etiqueta etiqueta--${claseRiesgo(c.riesgo)}">${c.riesgo}</span></td>
        <td><span class="etiqueta etiqueta--${claseRiesgo(c.urgencia)}">${c.urgencia}</span></td>
        <td>${c.plazo} días</td>
        <td>${insigniaAgente(c.id)}</td>
      </tr>`).join('');
    const avisos = NOTIFICACIONES.slice(0, 3).map((n) =>
      `<li class="aviso ${n.tipo === 'alerta' ? 'aviso--ambar' : ''}"><a href="#${n.ruta}">${n.texto}</a></li>`).join('');

    const cp = conteoPorPrioridad(casos.map((c) => c.id));
    return `
    <div class="pagina v-panel">
      <h1 class="pagina__titulo">Panel del analista</h1>
      <section class="resumen-agente" aria-label="Resumen del agente de IA">
        <strong>Agente Wayz</strong>
        <span>Revisó tus casos: <b>${cp.Crítica}</b> críticos, <b>${cp.Alta}</b> altos, <b>${cp.Media + cp.Baja}</b> de menor prioridad${cp.sinEvaluar ? `, ${cp.sinEvaluar} sin evaluar` : ''}.</span>
        <small>${textoDeEstado()}. Son sugerencias: la decisión es tuya.</small>
      </section>
      <div class="kpis" role="list" aria-label="Indicadores de tu cola">
        ${kpi('Casos en mi cola', casos.length, 'asignados a ti')}
        ${kpi('Críticos', casos.filter((c) => c.riesgo === 'Alto').length, 'riesgo alto')}
        ${kpi('Vencen hoy', casos.filter((c) => c.plazo <= 2).length, 'plazo de 2 días o menos')}
        ${kpi('Nuevos asignados', casos.filter((c) => c.estado === 'Nuevo').length, 'sin iniciar')}
      </div>
      <div class="dos-columnas">
        <section class="tarjeta" aria-labelledby="t-casos">
          <h2 id="t-casos">Casos priorizados por riesgo</h2>
          <table class="tabla" data-sin-navegar>
            <thead><tr><th>Caso</th><th>Tipo</th><th>Riesgo</th><th>Urgencia</th><th>Plazo</th><th>Sugerido por el agente</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
          <button type="button" class="boton boton--primario boton--abrir" id="abrir-caso">Abrir caso seleccionado</button>
        </section>
        <aside class="tarjeta" aria-labelledby="t-avisos">
          <h2 id="t-avisos">Notificaciones</h2>
          <ul class="lista-avisos">${avisos}</ul>
          <a class="enlace" href="#/notificaciones">Ver todas</a>
        </aside>
      </div>
    </div>`;
  },
};
