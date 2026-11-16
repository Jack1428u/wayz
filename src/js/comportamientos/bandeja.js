// Bandeja: filtros en vivo, conteo de resultados y vista previa del caso seleccionado.
import { buscarCaso, claseRiesgo, formatoMoneda } from '../datos/datos.js';
import { trabajo } from '../nucleo/almacen.js';
import { retrasar } from '../nucleo/dom.js';
import { evaluacionDe } from '../datos/agente.js';

export default function bandeja(raiz, ctx) {
  const form = raiz.querySelector('.filtros');
  const filas = [...raiz.querySelectorAll('#tabla-casos tbody tr')];
  const conteo = raiz.querySelector('#conteo');
  const vacio = raiz.querySelector('#vacio');
  const tabla = raiz.querySelector('#tabla-casos');
  const todosCasos = (id) => buscarCaso(id) ?? trabajo.casosNuevos.find((c) => c.id === id);

  function previsualizar(id) {
    const c = todosCasos(id);
    if (!c) return;
    filas.forEach((f) => f.classList.toggle('seleccionada', f.dataset.id === id));
    raiz.querySelector('#vp-caso').textContent = `${c.id} · ${c.tipo}`;
    raiz.querySelector('#vp-riesgo').innerHTML = `<span class="etiqueta etiqueta--${claseRiesgo(c.riesgo)}">Riesgo: ${c.riesgo}</span>`;
    raiz.querySelector('#vp-texto').textContent =
      `${c.reclamante} (${c.asegurado}). Póliza ${c.poliza}. Monto reclamado ${formatoMoneda(c.monto)}. Plazo restante: ${c.plazo} días. Estado: ${c.estado}.`;
    const ev = evaluacionDe(id);
    raiz.querySelector('#vp-agente').textContent = ev ? `Agente Wayz: ${ev.resumen}` : 'El agente aún no evaluó este caso.';
    raiz.querySelector('#vp-abrir').href = `#/expediente/${id}/resumen`;
  }

  function filtrar() {
    const q = form.q.value.trim().toLowerCase();
    let visibles = 0;
    filas.forEach((f) => {
      const ver = (!q || f.dataset.texto.includes(q))
        && (!form.riesgo.value || f.dataset.riesgo === form.riesgo.value)
        && (!form.estado.value || f.dataset.estado === form.estado.value);
      f.hidden = !ver;
      if (ver) visibles++;
    });
    tabla.hidden = visibles === 0;
    vacio.hidden = visibles !== 0;
    conteo.textContent = `${visibles} de ${filas.length} reclamos`;
    const primera = filas.find((f) => !f.hidden);
    if (primera && !filas.some((f) => f.classList.contains('seleccionada') && !f.hidden)) previsualizar(primera.dataset.id);
  }

  form.addEventListener('input', retrasar(filtrar));
  form.addEventListener('change', filtrar);
  form.addEventListener('reset', () => setTimeout(filtrar));
  raiz.querySelector('#vaciar').addEventListener('click', () => { form.reset(); form.q.focus(); });
  tabla.tBodies[0].addEventListener('click', (e) => {
    const fila = e.target.closest('tr');
    if (fila && !e.target.closest('a')) previsualizar(fila.dataset.id);
  });
  // El foco del teclado en un enlace también actualiza la vista previa (comparable a pasar el ratón).
  tabla.tBodies[0].addEventListener('focusin', (e) => e.target.closest('tr') && previsualizar(e.target.closest('tr').dataset.id));

  filtrar();
}
