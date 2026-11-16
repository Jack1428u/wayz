// Cabecera común de las pantallas del expediente (W-08 a W-12 y W-17).
// Se escribe una sola vez; antes estaba copiada en cada pantalla.

import { buscarCaso, claseRiesgo, claseEstado } from '../datos/datos.js';
import { trabajo } from '../nucleo/almacen.js';
import { esc } from '../nucleo/dom.js';
import { hayBaseDeDatos } from '../datos/supabase.js';

const SUBPESTANAS = [
  ['resumen', 'Resumen'],
  ['documentos', 'Documentos'],
  ['inconsistencias', 'Inconsistencias'],
  ['identidad', 'Identidad y listas'],
  ['similares', 'Similares y redes'],
  ['bitacora', 'Bitácora'],
];
const ACTIVA = { Resumen: 'resumen', Documentos: 'documentos', Inconsistencias: 'inconsistencias', 'Identidad y listas': 'identidad', 'Similares y redes': 'similares', Bitácora: 'bitacora' };

export function expedienteHeader(nombreActivo, ctx) {
  const id = ctx.params.caso ?? 'RCL-2041';
  // Si el caso no está en la bandeja (por ejemplo, ya fue decidido), no se inventan datos: se dice lo que se sabe.
  const sinDatos = { riesgo: null, estado: hayBaseDeDatos ? 'Cerrado (decidido)' : 'En revisión', plazo: null, asegurado: 'consulta la pestaña «Identidad y listas»' };
  const caso = buscarCaso(id) ?? trabajo.casosNuevos.find((c) => c.id === id) ?? (hayBaseDeDatos ? sinDatos : { riesgo: 'Alto', estado: 'En revisión', plazo: 2, asegurado: 'nombre del asegurado' });
  const activa = ACTIVA[nombreActivo];
  const enlaces = SUBPESTANAS.map(([ruta, nombre]) =>
    `<a href="#/expediente/${esc(id)}/${ruta}" ${ruta === activa ? 'class="activo" aria-current="page"' : ''}>${nombre}</a>`).join('');
  return `
    <p class="migas"><a href="#/reclamos">Reclamos</a> › Expediente del caso › ${esc(id)}</p>
    <div class="encabezado">
      <h1 class="pagina__titulo">Expediente ${esc(id)}</h1>
      <div class="encabezado__botones">
        <button type="button" class="boton" data-dialog="escalar">Escalar</button>
        <button type="button" class="boton boton--primario" data-dialog="decision">Decidir</button>
      </div>
    </div>
    <div class="chips">
      ${caso.riesgo ? `<span class="etiqueta etiqueta--${claseRiesgo(caso.riesgo)}">Riesgo: ${caso.riesgo}</span>` : ''}
      <span class="etiqueta etiqueta--${claseEstado(caso.estado)}">Estado: ${esc(caso.estado)}</span>
      ${caso.plazo != null ? `<span class="etiqueta etiqueta--gris">Plazo: ${caso.plazo} días</span>` : ''}
      <small>Asegurado: ${esc(caso.asegurado)}</small>
    </div>
    <div class="subpestanas">
      <nav aria-label="Secciones del expediente">${enlaces}</nav>
      <button type="button" class="boton boton--ia" data-dialog="asistente">Asistente IA</button>
    </div>`;
}
