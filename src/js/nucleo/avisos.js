// Retroalimentación al usuario (heurística 1: visibilidad del estado del sistema).
// - anunciar(): región «aria-live» que leen los lectores de pantalla sin mover el foco.
// - toast(): mensaje visible y temporal; no depende solo del color (lleva icono y texto).

const ICONOS = { ok: '✔', info: 'ℹ', alerta: '⚠', error: '✖' };

export function anunciar(texto) {
  const region = document.getElementById('avisos');
  if (!region) return;
  region.textContent = '';
  // El pequeño retardo hace que el lector detecte el cambio aunque el texto se repita.
  setTimeout(() => { region.textContent = texto; }, 60);
}

export function toast(mensaje, tipo = 'info') {
  const zona = document.getElementById('toasts');
  if (!zona) return;
  const el = document.createElement('div');
  el.className = `toast toast--${tipo}`;
  el.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
  el.innerHTML = `<span class="toast__icono" aria-hidden="true">${ICONOS[tipo] ?? ICONOS.info}</span>
    <span class="toast__texto"></span>
    <button type="button" class="toast__cerrar" aria-label="Cerrar aviso">×</button>`;
  el.querySelector('.toast__texto').textContent = mensaje;
  const quitar = () => el.remove();
  el.querySelector('.toast__cerrar').addEventListener('click', quitar);
  zona.append(el);
  setTimeout(quitar, tipo === 'error' ? 10000 : 6000);
}
