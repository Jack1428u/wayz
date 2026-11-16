// Reportes regulatorios (W-41): programar un envío automático y verlo en la tabla de estado.
import { validarFormulario } from '../nucleo/formularios.js';
import { toast } from '../nucleo/avisos.js';

export default function reportes(raiz) {
  const form = raiz.querySelector('#f-reporte');
  const tabla = [...raiz.querySelectorAll('tbody')].pop();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarFormulario(form)) return;
    const [periodicidad, dia] = form.querySelectorAll('select');
    const fila = tabla.insertRow(0);
    [`Reporte ${periodicidad.value.toLowerCase()}`, dia.value, form.destinatario.value, 'Programado'].forEach((t) => (fila.insertCell().textContent = t));
    fila.classList.add('seleccionada');
    toast(`Envío ${periodicidad.value.toLowerCase()} programado para ${form.destinatario.value}.`, 'ok');
    form.destinatario.value = '';
  });
}
