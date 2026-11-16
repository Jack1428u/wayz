// Casos similares y redes (W-11): reclamos vinculados guardados en la base de datos.
import { hayBaseDeDatos } from '../datos/supabase.js';
import { similaresDe } from '../datos/repositorio.js';

const AJUSTE = { Aprobar: ['Aprobado', 'verde'], Rechazar: ['Rechazado', 'rojo'], 'Derivar a Legal': ['Derivado', 'ambar'] };

export default function similares(raiz, ctx) {
  if (!hayBaseDeDatos) return;
  const cuerpo = raiz.querySelector('tbody');
  similaresDe(ctx.params.caso).then((filas) => {
    cuerpo.replaceChildren();
    if (!filas.length) {
      const c = cuerpo.insertRow().insertCell();
      c.colSpan = 4; c.textContent = 'No se encontraron casos vinculados.';
      return;
    }
    filas.forEach((f, i) => {
      const fila = cuerpo.insertRow();
      if (i === 0) fila.classList.add('seleccionada');
      fila.insertCell().append(Object.assign(document.createElement('a'), { href: '#/historial', textContent: f.codigo, title: f.motivo }));
      fila.insertCell().textContent = f.fecha ? f.fecha.split('-').reverse().slice(1).join('/') : '';
      const [texto, color] = AJUSTE[f.decision] ?? [f.estado, 'gris'];
      fila.insertCell().append(Object.assign(document.createElement('span'), { className: `etiqueta etiqueta--${color}`, textContent: texto }));
      fila.insertCell().textContent = `${f.similitud} %`;
    });
  }).catch(() => {});
}
