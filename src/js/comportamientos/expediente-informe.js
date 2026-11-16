// Informe (W-16): se prepara con los datos del caso y las señales del agente; se guarda como borrador y se exporta a PDF.
import { buscarCaso } from '../datos/datos.js';
import { evaluacionDe } from '../datos/agente.js';
import { trabajo } from '../nucleo/almacen.js';
import { toast } from '../nucleo/avisos.js';

const clave = (id) => `wayz.borrador.${id}`;

export default function informe(raiz, ctx) {
  const id = ctx.params.caso ?? trabajo.casoActual;
  const caso = buscarCaso(id);
  const texto = raiz.querySelector('.texto-editable');

  raiz.querySelector('.pagina__titulo').textContent = `Informe del caso ${id}`;
  const datos = raiz.querySelector('dl.datos');
  const valores = [id, caso?.asegurado ?? '—', caso?.poliza ?? '—', caso?.riesgo ?? '—', trabajo.decision?.caso === id ? trabajo.decision.tipo : 'Pendiente'];
  datos.querySelectorAll('dd').forEach((dd, i) => (dd.textContent = valores[i] ?? dd.textContent));
  raiz.querySelectorAll('a[href*="/bitacora"]').forEach((a) => (a.href = `#/expediente/${id}/bitacora`));

  // Texto inicial: borrador guardado, o hallazgos redactados a partir de la evaluación del agente (editables).
  let borrador = null;
  try { borrador = localStorage.getItem(clave(id)); } catch { /* sin almacenamiento */ }
  const e = evaluacionDe(id);
  texto.textContent = borrador
    ?? (e ? `${e.resumen} Señales detectadas: ${e.motivos.join('; ')}. Acción sugerida por el agente: ${e.accion} (Recomendación sujeta a la decisión del analista.)`
      : 'Aún no hay hallazgos registrados para este caso. Redáctalos aquí.');

  const [guardar, exportar] = raiz.querySelectorAll('.encabezado__botones [data-accion]');
  guardar.removeAttribute('data-accion');
  exportar.removeAttribute('data-accion');
  guardar.addEventListener('click', () => {
    try { localStorage.setItem(clave(id), texto.textContent); toast('Borrador guardado en este equipo.', 'ok'); }
    catch { toast('No se pudo guardar el borrador (almacenamiento bloqueado).', 'alerta'); }
  });
  exportar.addEventListener('click', () => {
    toast('Se abrirá el diálogo de impresión: elige «Guardar como PDF».', 'info');
    setTimeout(() => window.print(), 400);
  });
}
