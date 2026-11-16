// Vista: Bandeja de reclamos (wireframe W-06). El comportamiento (filtros, vista previa) está en comportamientos/bandeja.js
import '../../styles/vistas/bandeja.css';
import '../../styles/vistas/bandeja-extra.css';
import { CASOS, RIESGOS, ESTADOS, claseRiesgo } from '../datos/datos.js';
import { trabajo } from '../nucleo/almacen.js';
import { esc } from '../nucleo/dom.js';

export const todosLosCasos = () => [...trabajo.casosNuevos, ...CASOS];

export default {
  render: ({ query, rol }) => {
    const opciones = (lista, titulo) => `<option value="">${titulo}</option>${lista.map((o) => `<option>${o}</option>`).join('')}`;
    const filas = todosLosCasos().map((c) => `
      <tr data-id="${esc(c.id)}" data-riesgo="${esc(c.riesgo)}" data-estado="${esc(c.estado)}"
          data-texto="${esc(`${c.id} ${c.asegurado} ${c.reclamante} ${c.tipo} ${c.poliza}`.toLowerCase())}"
          class="${c.riesgo === 'Alto' ? 'destacada' : ''}">
        <td><a href="#/expediente/${c.id}/resumen"><b>${c.id}</b></a></td>
        <td>${esc(c.asegurado)}</td><td>${esc(c.tipo)}</td>
        <td><span class="etiqueta etiqueta--${claseRiesgo(c.riesgo)}">${c.riesgo}</span></td>
        <td><span class="etiqueta etiqueta--${claseRiesgo(c.urgencia)}">${c.urgencia}</span></td>
        <td>${c.plazo} d</td>
        <td>${c.estado === 'Nuevo' ? esc(c.estado) : `<span class="etiqueta etiqueta--ambar">${esc(c.estado)}</span>`}</td>
      </tr>`).join('');
    const puedeRegistrar = ['analista', 'lider'].includes(rol);

    return `
    <div class="pagina v-bandeja">
      <div class="encabezado">
        <h1 class="pagina__titulo">Bandeja de reclamos</h1>
        ${puedeRegistrar ? '<a class="boton boton--primario" href="#/reclamos/nuevo">Registrar reclamo</a>' : ''}
      </div>

      <form class="filtros" role="search" aria-label="Filtrar reclamos" data-propio>
        <label class="solo-lectores" for="f-q">Buscar palabra clave en reclamo y adjuntos</label>
        <input id="f-q" name="q" type="search" placeholder="Buscar palabra clave en reclamo y adjuntos" value="${esc(query.q ?? '')}">
        <label class="solo-lectores" for="f-riesgo">Riesgo</label>
        <select id="f-riesgo" name="riesgo">${opciones(RIESGOS, 'Riesgo: todos')}</select>
        <label class="solo-lectores" for="f-estado">Estado</label>
        <select id="f-estado" name="estado">${opciones(ESTADOS, 'Estado: todos')}</select>
        <button type="reset" class="boton" id="limpiar">Limpiar filtros</button>
      </form>
      <p class="conteo" id="conteo" role="status"></p>

      <div class="tabla-y-vista">
        <section class="tarjeta" aria-label="Lista de reclamos">
          <table class="tabla" id="tabla-casos" data-sin-navegar>
            <thead><tr><th>Caso</th><th>Asegurado</th><th>Tipo</th><th>Riesgo</th><th>Urgencia</th><th>Plazo</th><th>Estado</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
          <div class="vacio" id="vacio" hidden>
            <p><strong>No hay reclamos con esos filtros.</strong></p>
            <p>Prueba con otra palabra o quita algún filtro.</p>
            <button type="button" class="boton" id="vaciar">Quitar todos los filtros</button>
          </div>
        </section>

        <aside class="tarjeta vista-previa" aria-labelledby="vp-titulo" aria-live="polite">
          <h2 id="vp-titulo">Vista previa</h2>
          <p class="vista-previa__caso" id="vp-caso"></p>
          <p id="vp-riesgo"></p>
          <p class="vista-previa__texto" id="vp-texto"></p>
          <p class="vista-previa__agente" id="vp-agente"></p>
          <a class="boton boton--primario" id="vp-abrir" href="#/reclamos">Abrir expediente</a>
        </aside>
      </div>
    </div>`;
  },
};
