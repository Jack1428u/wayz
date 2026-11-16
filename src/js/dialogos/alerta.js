// Ventana: Alerta emergente con sonido (wireframe W-05). Se abre sola en el Centro de comando.
import { pitar } from '../nucleo/sonido.js';
import { toast } from '../nucleo/avisos.js';

export default {
  titulo: () => 'Alerta crítica – evento detectado',
  clase: 'dialogo--critico',
  ancho: 540,
  render: () => `
    <p class="banner">Posible fraude coordinado: 4 reclamos vinculados en 48 horas</p>
    <table class="tabla">
      <caption class="solo-lectores">Resumen del evento</caption>
      <thead><tr><th scope="col">Dato</th><th scope="col">Detalle</th></tr></thead>
      <tbody>
        <tr><td>Zona</td><td>Sur</td></tr>
        <tr><td>Casos vinculados</td><td>4</td></tr>
        <tr><td>Asegurados en común</td><td>2</td></tr>
        <tr><td>Monto agregado</td><td>S/ 86 000</td></tr>
      </tbody>
    </table>
    <div class="modal__acciones">
      <a class="boton boton--primario" href="#/expediente/RCL-2038/similares" data-cerrar>Ver red sospechosa</a>
      <button type="button" class="boton" data-silenciar>Silenciar</button>
      <button type="button" class="boton" data-cerrar>Cerrar</button>
    </div>`,
  init(d) {
    d.setAttribute('role', 'alertdialog'); // los lectores de pantalla la anuncian de inmediato
    pitar();
    d.querySelector('[data-silenciar]').addEventListener('click', () => {
      toast('Alerta silenciada. Seguirá visible en «Alertas recientes».', 'info');
      d.close('silenciar');
    });
  },
};
