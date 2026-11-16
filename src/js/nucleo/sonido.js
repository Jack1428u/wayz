// Aviso sonoro de las alertas críticas (W-04 / W-05). Se genera con la Web Audio API: no necesita archivos.
import { obtenerPrefs } from './almacen.js';

export function pitar() {
  if (!obtenerPrefs().sonido) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 660].forEach((frecuencia, i) => {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.frequency.value = frecuencia;
      vol.gain.value = 0.08;
      osc.connect(vol).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.2);
    });
  } catch { /* el navegador puede bloquear el audio hasta que el usuario interactúe */ }
}
