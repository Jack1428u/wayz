// Comportamientos globales por «delegación de eventos»: un solo oyente en el documento atiende
// cualquier botón o formulario, sin importar en qué vista esté. Se activan con atributos data-*:
//   data-dialog="id"      abre una ventana (src/dialogos/id.js)
//   data-accion="texto"   acción simulada: muestra un aviso para confirmar que la app respondió
//   data-alternar="id"    muestra u oculta el elemento con ese id
//   data-segmento="x"     botón de un grupo con estado (aria-pressed); en .segmentos también filtra la tabla

import { abrirDialogo } from './dialogo.js';
import { toast, anunciar } from './avisos.js';
import { validarFormulario } from './formularios.js';
import { obtenerSesion } from './almacen.js';

export function iniciarInteracciones() {
  document.addEventListener('click', (e) => {
    const abre = e.target.closest('[data-dialog]');
    if (abre) { e.preventDefault(); abrirDialogo(abre.dataset.dialog, { origen: abre }); return; }

    const alterna = e.target.closest('[data-alternar]');
    if (alterna) {
      const destino = document.getElementById(alterna.dataset.alternar);
      const visible = destino.hidden;
      destino.hidden = !visible;
      alterna.setAttribute('aria-expanded', String(visible));
      if (visible) destino.querySelector('input, select, button, a')?.focus();
      return;
    }

    const segmento = e.target.closest('[data-segmento]');
    if (segmento) { alternarSegmento(segmento); return; }

    const accion = e.target.closest('[data-accion]');
    if (accion) {
      const texto = accion.dataset.accion || accion.textContent.trim();
      toast(`«${texto}»: acción simulada. Esta función se conectará al servidor en una próxima versión.`, 'info');
    }
  });

  // Ningún formulario recarga la página; se validan y se informa el resultado.
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    e.preventDefault();
    if (form.hasAttribute('data-propio')) return; // lo gestiona la vista o el diálogo
    if (form.matches('[role="search"], .filtros')) return;
    if (!validarFormulario(form)) return;
    toast(form.dataset.ok ?? 'Cambios guardados correctamente.', 'ok');
    if (form.dataset.destino) location.hash = `#${form.dataset.destino}`;
  });

  // Atajos para usuarios frecuentes (heurística 7: flexibilidad y eficiencia). No se activan mientras se escribe.
  //   «/» busca · «?» abre la ayuda de la pantalla · «N» registra un reclamo (solo si el rol puede hacerlo)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable]') || document.querySelector('dialog[open]')) return;
    const sesion = obtenerSesion();
    if (!sesion) return;
    if (e.key === '/') {
      const b = document.getElementById('buscar');
      if (b) { e.preventDefault(); b.focus(); }
    } else if (e.key === '?') {
      e.preventDefault();
      abrirDialogo('ayuda', { origen: document.activeElement });
    } else if (e.key.toLowerCase() === 'n' && ['analista', 'lider'].includes(sesion.rol)) {
      e.preventDefault();
      location.hash = '#/reclamos/nuevo';
    }
  });
}

function alternarSegmento(boton) {
  const grupo = boton.closest('[role="group"]');
  const esHerramienta = grupo.classList.contains('herramientas');
  if (esHerramienta) {
    boton.setAttribute('aria-pressed', String(boton.getAttribute('aria-pressed') !== 'true'));
    boton.classList.toggle('boton--primario');
    return;
  }
  grupo.querySelectorAll('[data-segmento]').forEach((b) => {
    const activo = b === boton;
    b.setAttribute('aria-pressed', String(activo));
    b.classList.toggle('boton--primario', activo);
  });
  if (!grupo.matches('.segmentos') || grupo.dataset.filtro === 'no') return;
  // Filtro simple: oculta las filas de la tabla que no mencionan el valor elegido.
  const valor = boton.dataset.segmento.toLowerCase();
  const todas = /^todos?$/.test(valor);
  const filas = [...grupo.closest('.pagina').querySelectorAll('table.tabla tbody tr')];
  let visibles = 0;
  filas.forEach((f) => {
    const ver = todas || f.textContent.toLowerCase().includes(valor);
    f.hidden = !ver;
    if (ver) visibles++;
  });
  anunciar(`${visibles} ${visibles === 1 ? 'resultado' : 'resultados'} para «${boton.dataset.segmento}».`);
}
