// Ventana: Ayuda de la pantalla actual (heurística 10: ayuda breve, centrada en la tarea y fácil de encontrar).
import '../../styles/ayuda.css';
import { RUTAS, compilar } from '../config/rutas.js';
import { AYUDA, AYUDA_GENERAL, ATAJOS } from '../config/ayuda.js';

const compiladas = RUTAS.map((r) => ({ ...r, ...compilar(r.ruta) }));
const rutaActual = () => {
  const path = location.hash.replace(/^#/, '').split('?')[0] || '/';
  return compiladas.find((r) => r.regex.test(path));
};
const contenido = () => {
  const r = rutaActual();
  return { ruta: r, ayuda: (r && AYUDA[r.vista]) ?? AYUDA_GENERAL };
};

export default {
  titulo: () => `Ayuda: ${contenido().ruta?.titulo ?? 'Wayz'}`,
  ancho: 560,
  render: () => {
    const { ayuda } = contenido();
    return `
      <p class="ayuda-objetivo"><strong>Qué puedes hacer aquí:</strong> ${ayuda.objetivo}</p>
      <ol class="ayuda-pasos">${ayuda.pasos.map((p) => `<li>${p}</li>`).join('')}</ol>
      <h3 class="ayuda-subtitulo">Atajos de teclado</h3>
      <dl class="ayuda-atajos">${ATAJOS.map(([t, d]) => `<div><dt><kbd>${t}</kbd></dt><dd>${d}</dd></div>`).join('')}</dl>
      <div class="modal__acciones">
        <button type="button" class="boton" data-dialog="soporte" data-cerrar>¿Necesitas más ayuda? Soporte técnico</button>
        <button type="button" class="boton boton--primario" data-cerrar>Entendido</button>
      </div>`;
  },
};
