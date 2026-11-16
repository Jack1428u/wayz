// Carga del equipo (W-38): redistribuir casos con confirmación y aviso a ambos analistas.
import { confirmar } from '../nucleo/dialogo.js';
import { toast, anunciar } from '../nucleo/avisos.js';

export default function equipo(raiz) {
  const filas = [...raiz.querySelectorAll('.analista')];
  const casillas = () => [...raiz.querySelectorAll('.equipo .tarjeta .casilla input')];
  const boton = raiz.querySelector('#reasignar');
  const destino = raiz.querySelector('.equipo select');
  destino.innerHTML = filas.slice(1).map((f) => `<option>${f.querySelector('span').childNodes[0].textContent.trim()}</option>`).join('');
  destino.value = destino.options[destino.options.length - 1].value;

  const casos = (fila) => parseInt(fila.querySelector('b').textContent, 10);
  function pintarFila(fila, n) {
    fila.querySelector('b').textContent = `${n} casos`;
    fila.querySelector('.progreso > div').style.width = `${Math.min(100, Math.round((n / 20) * 100))}%`;
    fila.querySelector('.etiqueta')?.toggleAttribute('hidden', n < 17);
  }
  function actualizarBoton() {
    const n = casillas().filter((c) => c.checked).length;
    boton.textContent = `Reasignar ${n} ${n === 1 ? 'caso' : 'casos'}`;
    boton.disabled = n === 0;
  }
  raiz.addEventListener('change', actualizarBoton);
  actualizarBoton();

  boton.addEventListener('click', async () => {
    const elegidos = casillas().filter((c) => c.checked);
    const para = filas.find((f) => f.querySelector('span').childNodes[0].textContent.trim() === destino.value);
    const si = await confirmar({
      titulo: '¿Reasignar casos?',
      mensaje: `Vas a pasar ${elegidos.length} ${elegidos.length === 1 ? 'caso' : 'casos'} de Analista 1 a ${destino.value}. Ambos recibirán un aviso.`,
      aceptar: 'Sí, reasignar',
    });
    if (!si) return;
    pintarFila(filas[0], casos(filas[0]) - elegidos.length);
    pintarFila(para, casos(para) + elegidos.length);
    elegidos.forEach((c) => c.closest('label').remove());
    actualizarBoton();
    toast(`${elegidos.length} ${elegidos.length === 1 ? 'caso reasignado' : 'casos reasignados'} a ${destino.value}.`, 'ok');
    anunciar('Carga del equipo actualizada.');
  });
}
