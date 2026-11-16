// Ventana: Firma digital del dictamen (wireframe W-29)
import { trabajo } from '../nucleo/almacen.js';
import { validarFormulario } from '../nucleo/formularios.js';
import { confirmar } from '../nucleo/dialogo.js';
import { toast } from '../nucleo/avisos.js';

export default {
  titulo: () => `Firmar dictamen – ${trabajo.casoActual}`,
  ancho: 540,
  render: () => `
    <form id="f-firma" data-propio novalidate>
      <div class="vista-dictamen" role="img" aria-label="Vista previa del dictamen">Vista previa del dictamen</div>
      <label class="campo"><span>Certificado digital calificado</span>
        <select name="certificado" required data-mensaje="Elige el certificado con el que vas a firmar.">
          <option value="">Seleccionar certificado</option><option>Certificado personal (vence 03/2027)</option><option>Certificado de la empresa (vence 11/2026)</option>
        </select></label>
      <label class="campo campo--medio"><span>Contraseña del certificado</span>
        <input type="password" name="clave" required minlength="8" autocomplete="off"
               data-mensaje="Escribe la contraseña del certificado (mínimo 8 caracteres)."></label>
      <label class="casilla"><input type="checkbox" name="notificar"> Notificar al reclamante después de firmar</label>
      <div class="modal__acciones">
        <button type="button" class="boton" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton--primario">Firmar dictamen</button>
      </div>
    </form>`,
  init(d) {
    const form = d.querySelector('#f-firma');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) return;
      const si = await confirmar({
        titulo: '¿Firmar el dictamen?',
        mensaje: 'La firma digital tiene validez legal y no se puede retirar después.',
        aceptar: 'Sí, firmar',
      });
      if (!si) return;
      toast('Dictamen firmado correctamente (simulación).', 'ok');
      d.close('listo');
      location.hash = '#/legal/notificaciones';
    });
  },
};
