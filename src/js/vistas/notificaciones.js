// Vista: Notificaciones (pestaña del panel; no existe en los wireframes pero la pestaña lo exige).
import '../../styles/vistas/notificaciones.css';
import { NOTIFICACIONES } from '../datos/datos.js';

const ICONO = { info: 'ℹ', alerta: '⚠', plazo: '⏱' };

export default {
  render: () => `
    <div class="pagina v-notificaciones">
      <div class="encabezado">
        <h1 class="pagina__titulo">Notificaciones</h1>
        <button type="button" class="boton" id="marcar-leidas">Marcar todo como leído</button>
      </div>
      <ul class="lista-notificaciones">
        ${NOTIFICACIONES.map((n) => `
          <li class="notificacion ${n.leida ? '' : 'notificacion--nueva'}" data-id="${n.id}">
            <span class="notificacion__icono" aria-hidden="true">${ICONO[n.tipo]}</span>
            <a href="#${n.ruta}">${n.texto}</a>
            <span class="etiqueta ${n.leida ? 'etiqueta--gris' : 'etiqueta--ambar'}">${n.leida ? 'Leída' : 'Nueva'}</span>
          </li>`).join('')}
      </ul>
    </div>`,
};
