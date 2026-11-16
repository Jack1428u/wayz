// Paquete certificado (W-33): el índice se arma con los documentos marcados.
import { toast } from '../nucleo/avisos.js';

export default function paquete(raiz) {
  const casillas = [...raiz.querySelectorAll('.paquete input[type="checkbox"]')];
  const indice = raiz.querySelector('.indice');
  const destino = raiz.querySelector('select');

  function actualizar() {
    indice.querySelectorAll('p').forEach((p) => p.remove());
    let pagina = 1;
    const elegidos = casillas.filter((c) => c.checked);
    elegidos.forEach((c, i) => {
      const p = document.createElement('p');
      p.textContent = `${i + 1}. ${c.parentElement.textContent.trim()} ....... p. ${pagina}`;
      pagina += 4 + i * 3; // páginas de ejemplo
      indice.append(p);
    });
    if (!elegidos.length) {
      const p = document.createElement('p');
      p.textContent = 'Marca al menos un documento para armar el índice.';
      indice.append(p);
    }
    const generar = raiz.querySelector('[data-generar]');
    generar.setAttribute('aria-disabled', String(!elegidos.length));
  }
  casillas.forEach((c) => c.addEventListener('change', actualizar));
  actualizar();

  raiz.querySelector('[data-generar]').addEventListener('click', (e) => {
    const n = casillas.filter((c) => c.checked).length;
    if (!n) { e.preventDefault(); toast('Marca al menos un documento antes de generar el expediente.', 'alerta'); return; }
    toast(`Expediente certificado para ${destino.value || 'SBS'} generado con ${n} documentos (simulación).`, 'ok');
  });
}
