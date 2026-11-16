// Mejoras de accesibilidad y usabilidad que se aplican a cualquier contenido recién dibujado.
// Así cada vista conserva un HTML sencillo y estas reglas viven en un solo lugar.

import { anunciar } from './avisos.js';

/** Número o texto comparable de una celda (soporta «S/ 86 000», «92 %», «2 días»). */
const valorCelda = (td) => {
  const t = td.textContent.trim();
  const n = parseFloat(t.replace(/[^\d.,-]/g, '').replace(/\s/g, '').replace(',', '.'));
  return Number.isNaN(n) ? t.toLowerCase() : n;
};

function hacerOrdenable(tabla) {
  const cuerpo = tabla.tBodies[0];
  if (!cuerpo || cuerpo.rows.length < 3) return;
  tabla.tHead?.rows[0]?.querySelectorAll('th').forEach((th, indice) => {
    const nombre = th.textContent.trim();
    if (!nombre) return;
    th.setAttribute('scope', 'col');
    th.setAttribute('aria-sort', 'none');
    th.innerHTML = '<button type="button" class="th-orden"></button>';
    th.firstChild.textContent = nombre;
    th.firstChild.addEventListener('click', () => {
      const asc = th.getAttribute('aria-sort') !== 'ascending';
      tabla.querySelectorAll('th').forEach((o) => o.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
      [...cuerpo.rows]
        .sort((a, b) => {
          const x = valorCelda(a.cells[indice]);
          const y = valorCelda(b.cells[indice]);
          return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1);
        })
        .forEach((fila) => cuerpo.append(fila));
      anunciar(`Tabla ordenada por ${nombre}, ${asc ? 'de menor a mayor' : 'de mayor a menor'}.`);
    });
  });
}

function mejorarTablas(raiz) {
  raiz.querySelectorAll('table.tabla').forEach((tabla) => {
    // Contenedor desplazable y accesible con teclado, para pantallas estrechas.
    if (!tabla.parentElement.classList.contains('tabla-scroll')) {
      const cont = document.createElement('div');
      cont.className = 'tabla-scroll';
      cont.tabIndex = 0;
      cont.setAttribute('role', 'region');
      const titulo = tabla.closest('.tarjeta')?.querySelector('h2')?.textContent;
      cont.setAttribute('aria-label', titulo ? `Tabla: ${titulo}` : 'Tabla de datos');
      tabla.replaceWith(cont);
      cont.append(tabla);
    }
    tabla.querySelectorAll('thead th').forEach((th) => th.setAttribute('scope', 'col'));
    hacerOrdenable(tabla);
    // Filas con enlace: toda la fila es clicable (el enlace sigue siendo el control para teclado).
    if (tabla.hasAttribute('data-sin-navegar')) return;
    tabla.querySelectorAll('tbody tr').forEach((fila) => {
      const enlace = fila.querySelector('a[href^="#/"]');
      if (!enlace) return;
      fila.classList.add('fila-enlace');
      fila.addEventListener('click', (e) => {
        if (!e.target.closest('a, button, input, select')) location.hash = enlace.getAttribute('href');
      });
    });
  });
}

/** Los controles sin <label> reciben un nombre accesible a partir de su texto de ayuda. */
function etiquetarControles(raiz) {
  raiz.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'hidden' || el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return;
    const nombre = el.placeholder || el.options?.[0]?.textContent || el.title || el.name;
    if (nombre) el.setAttribute('aria-label', nombre.trim());
  });
  // Los interruptores se anuncian como «interruptor, activado/desactivado».
  raiz.querySelectorAll('.interruptor input[type="checkbox"]').forEach((i) => i.setAttribute('role', 'switch'));
  // Los grupos de botones con estado se agrupan para lectores de pantalla.
  raiz.querySelectorAll('button[data-segmento]').forEach((b) => b.hasAttribute('aria-pressed') || b.setAttribute('aria-pressed', 'false'));
}

export function mejorarContenido(raiz) {
  mejorarTablas(raiz);
  etiquetarControles(raiz);
  raiz.querySelectorAll('form').forEach((f) => (f.noValidate = true)); // la validación la hace formularios.js
}
