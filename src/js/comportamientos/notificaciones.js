import { NOTIFICACIONES } from '../datos/datos.js';
import { toast } from '../nucleo/avisos.js';
import { marcarNotificaciones } from '../datos/repositorio.js';

export default function notificaciones(raiz) {
  raiz.querySelector('#marcar-leidas').addEventListener('click', () => {
    marcarNotificaciones(NOTIFICACIONES.filter((n) => !n.leida).map((n) => n.id)).catch(() => toast('No se pudo guardar el cambio en la base de datos.', 'alerta'));
    NOTIFICACIONES.forEach((n) => (n.leida = true));
    raiz.querySelectorAll('.notificacion').forEach((li) => {
      li.classList.remove('notificacion--nueva');
      const marca = li.querySelector('.etiqueta');
      marca.className = 'etiqueta etiqueta--gris';
      marca.textContent = 'Leída';
    });
    document.querySelector('.cabecera__campana')?.setAttribute('aria-label', 'Notificaciones: 0 sin leer');
    document.querySelector('.insignia')?.remove();
    toast('Todas las notificaciones están marcadas como leídas.', 'ok');
  });
}
