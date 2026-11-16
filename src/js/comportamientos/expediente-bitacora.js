// Bitácora (W-17): historial real del caso (base de datos) y estado tras registrar una decisión (UF-04).
import { trabajo, obtenerSesion } from '../nucleo/almacen.js';
import { hayBaseDeDatos } from '../datos/supabase.js';
import { bitacoraDe } from '../datos/repositorio.js';

const cuando = (iso) => {
  const f = new Date(iso);
  return `${String(f.getDate()).padStart(2, '0')}/${String(f.getMonth() + 1).padStart(2, '0')} ${f.toTimeString().slice(0, 5)}`;
};
const recortar = (t) => (t.length > 80 ? `${t.slice(0, 80)}…` : t);

export default function bitacora(raiz, ctx) {
  const banner = raiz.querySelector('.estado-nuevo');
  const cuerpo = raiz.querySelector('tbody');
  const d = trabajo.decision;
  const hayDecision = d && d.caso === ctx.params.caso;

  if (!hayDecision) banner.textContent = 'Este caso aún no tiene una decisión registrada.';
  else {
    banner.textContent = `Estado actualizado: ${d.tipo}. Decisión registrada por ${obtenerSesion().nombre}.`;
    banner.setAttribute('role', 'status');
  }

  if (hayBaseDeDatos) {
    bitacoraDe(ctx.params.caso).then((filas) => {
      cuerpo.innerHTML = '';
      if (!filas.length) {
        const f = cuerpo.insertRow();
        const c = f.insertCell(); c.colSpan = 4; c.textContent = 'Aún no hay registros para este caso.';
        return;
      }
      filas.forEach((r, i) => {
        const fila = cuerpo.insertRow();
        [cuando(r.cuando), r.quien, r.accion, recortar(r.detalle)].forEach((t) => (fila.insertCell().textContent = t));
        if (i === 0) fila.classList.add('seleccionada');
      });
    }).catch(() => { banner.textContent = 'No se pudo cargar la bitácora. Inténtalo de nuevo en un momento.'; });
    return;
  }

  // Sin base de datos: demostración local
  if (!hayDecision) return;
  const fila = cuerpo.insertRow(0);
  [cuando(new Date()), obtenerSesion().nombre, 'Decisión', recortar(d.motivo)].forEach((t) => (fila.insertCell().textContent = t));
  fila.classList.add('seleccionada');
}
