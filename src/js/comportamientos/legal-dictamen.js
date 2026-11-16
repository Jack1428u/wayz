// Causal de exclusión (W-28): relacionar evidencias con la cláusula elegida y advertir si es ambigua.
import { toast } from '../nucleo/avisos.js';

export default function dictamen(raiz) {
  const evidencias = [...raiz.querySelectorAll('.causal .tarjeta:first-child input')];
  const clausulas = [...raiz.querySelectorAll('.causal .tarjeta:last-child input')];
  const resumen = raiz.querySelector('.causal-ok');
  const advertencia = raiz.querySelector('.advertencia');
  resumen.setAttribute('role', 'status');

  function actualizar() {
    const n = evidencias.filter((e) => e.checked).length;
    const c = clausulas.find((x) => x.checked);
    const num = c?.parentElement.textContent.trim().split(' ')[0];
    resumen.textContent = c
      ? `Causal identificada: cláusula ${num}, ${n ? `expresa y vinculada a ${n} ${n === 1 ? 'evidencia' : 'evidencias'}` : 'sin evidencias vinculadas'}.`
      : 'Elige una cláusula de exclusión de la póliza.';
    advertencia.hidden = num !== '4.5';
  }
  raiz.querySelector('[data-relacionar]').addEventListener('click', () => {
    actualizar();
    toast('Evidencias relacionadas con la cláusula elegida.', 'ok');
  });
  [...evidencias, ...clausulas].forEach((i) => i.addEventListener('change', actualizar));
  advertencia.setAttribute('role', 'alert');
  actualizar();
  advertencia.hidden = true;
}
