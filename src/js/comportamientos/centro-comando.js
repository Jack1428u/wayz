// Centro de comando: datos «en vivo», interruptor de alertas sonoras y alerta crítica emergente (W-04 → W-05).
import { cambiarPrefs, obtenerPrefs, trabajo } from '../nucleo/almacen.js';
import { abrirDialogo } from '../nucleo/dialogo.js';
import { toast } from '../nucleo/avisos.js';

export default function centroComando(raiz) {
  // «Actualizado hace N segundos»: el usuario ve que la información está al día (visibilidad del estado).
  const nota = raiz.querySelector('.nota');
  let segundos = 0;
  const reloj = setInterval(() => {
    segundos = (segundos + 1) % 16;
    if (nota) nota.textContent = `Actualizado hace ${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`;
  }, 1000);

  // El interruptor refleja y guarda la preferencia de sonido.
  const interruptor = raiz.querySelector('.interruptor input');
  interruptor.checked = obtenerPrefs().sonido;
  interruptor.addEventListener('change', () => {
    cambiarPrefs({ sonido: interruptor.checked });
    toast(`Alertas sonoras ${interruptor.checked ? 'activadas' : 'desactivadas'}.`, 'info');
  });

  // Pantalla completa para el centro de comando.
  raiz.querySelector('[data-pantalla]')?.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => toast('Tu navegador no permitió la pantalla completa.', 'alerta'));
  });

  // Simula un evento crítico a los pocos segundos de entrar (una sola vez por sesión).
  const espera = trabajo.alertaMostrada ? null : setTimeout(() => {
    trabajo.alertaMostrada = true;
    abrirDialogo('alerta');
  }, 7000);

  return () => { clearInterval(reloj); clearTimeout(espera); };
}
