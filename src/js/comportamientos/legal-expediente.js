// Expediente legal (W-22): el cronómetro del plazo se actualiza cuando se extiende, pausa o reanuda desde la ventana.
import { trabajo } from '../nucleo/almacen.js';
import { toast } from '../nucleo/avisos.js';

export default function expedienteLegal(raiz) {
  const dona = raiz.querySelector('.dona');
  const texto = dona.querySelector('span');
  const nota = raiz.querySelector('.plazo .nota-pie');
  texto.setAttribute('role', 'status');
  let pausado = false;

  function pintar() {
    const dias = trabajo.plazoLegalDias;
    const total = Math.max(30, dias);
    const pct = Math.round((dias / total) * 100);
    texto.textContent = `${dias} días`;
    nota.textContent = pausado ? 'Plazo en pausa' : `Quedan ${dias} de ${total} días`;
    dona.style.background = `conic-gradient(${pausado ? 'var(--pista-fuerte)' : 'var(--azul-oscuro)'} 0 ${pct}%, var(--pista) ${pct}% 100%)`;
  }
  const [pausar, reanudar] = [...raiz.querySelectorAll('.plazo__botones button')].filter((b) => !b.dataset.dialog);
  pausar.addEventListener('click', () => { pausado = true; pintar(); toast('Plazo legal en pausa.', 'info'); });
  reanudar.addEventListener('click', () => { pausado = false; pintar(); toast('Plazo legal en marcha.', 'info'); });
  [pausar, reanudar].forEach((b) => b.removeAttribute('data-accion'));

  const alCambiar = (e) => { pausado = e.detail.accion === 'pausar' ? true : e.detail.accion === 'reanudar' ? false : pausado; pintar(); };
  window.addEventListener('wayz:plazo', alCambiar);
  pintar();
  return () => window.removeEventListener('wayz:plazo', alCambiar);
}
