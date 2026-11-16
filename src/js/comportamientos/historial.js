// Historial de decisiones (W-18): búsqueda en la tabla y exportación para auditoría.
import { toast, anunciar } from '../nucleo/avisos.js';
import { hayBaseDeDatos } from '../datos/supabase.js';
import { HISTORIAL } from '../datos/repositorio.js';

const CLASE = { Aprobado: 'verde', Rechazado: 'rojo', 'Derivado a Legal': 'ambar' };

/** Con base de datos, la tabla se llena con las decisiones guardadas (textContent: sin riesgo de inyectar HTML). */
function llenarDesdeBD(raiz) {
  const cuerpo = raiz.querySelector('.historial tbody');
  cuerpo.replaceChildren();
  HISTORIAL.forEach((h, i) => {
    const fila = cuerpo.insertRow();
    if (i === 0) fila.classList.add('seleccionada');
    const enlace = Object.assign(document.createElement('a'), { href: '#/historial/auditoria', textContent: h.caso });
    fila.insertCell().append(enlace);
    fila.insertCell().textContent = new Date(h.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
    fila.insertCell().textContent = h.por;
    const etiqueta = Object.assign(document.createElement('span'), { className: `etiqueta etiqueta--${CLASE[h.decision] ?? 'gris'}`, textContent: h.decision });
    fila.insertCell().append(etiqueta);
    fila.insertCell().textContent = h.motivo;
  });
  const lateral = raiz.querySelector('aside.tarjeta');
  if (lateral) {
    const propios = HISTORIAL.slice(0, 2);
    lateral.querySelectorAll('.caso-similar').forEach((p, i) => {
      if (!propios[i]) return p.remove();
      p.querySelector('b').textContent = propios[i].caso;
      p.querySelector('small').textContent = propios[i].decision;
    });
  }
}

export default function historial(raiz) {
  if (hayBaseDeDatos) llenarDesdeBD(raiz);
  const filas = [...raiz.querySelectorAll('.historial tbody tr')];
  const buscar = raiz.querySelector('.filtros input[type="search"]');
  buscar?.addEventListener('input', () => {
    const q = buscar.value.trim().toLowerCase();
    let n = 0;
    filas.forEach((f) => { const ver = !q || f.textContent.toLowerCase().includes(q); f.hidden = !ver; if (ver) n++; });
    anunciar(`${n} resultados.`);
  });

  const panel = raiz.querySelector('#exportar');
  const generar = [...panel.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Generar');
  generar.removeAttribute('data-accion');
  generar.addEventListener('click', () => {
    const formato = panel.querySelector('input[type="radio"]:checked').parentElement.textContent.trim();
    const csv = ['caso,fecha,analista,decision,justificacion',
      ...filas.filter((f) => !f.hidden).map((r) => [...r.cells].map((c) => c.textContent.trim()).join(','))].join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: 'historial-decisiones.csv' });
    a.click(); URL.revokeObjectURL(a.href);
    toast(`Exportación lista (${formato}): se descargó un archivo CSV de ejemplo.`, 'ok');
    panel.hidden = true;
    raiz.querySelector('[data-alternar]').setAttribute('aria-expanded', 'false');
    raiz.querySelector('[data-alternar]').focus();
  });
}
