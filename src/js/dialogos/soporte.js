// Ventana: Soporte técnico local (wireframe W-45). Ayuda fácil de encontrar y centrada en la tarea (heurística 10).
import { validarFormulario } from '../nucleo/formularios.js';
import { toast } from '../nucleo/avisos.js';

export default {
  titulo: () => 'Soporte técnico local',
  ancho: 540,
  render: () => `
    <div class="contacto">
      <section class="tarjeta">
        <h3>Llamar</h3>
        <p class="telefono"><a href="tel:+51000000000">+51 000 000 000</a></p>
        <small>Lun a sáb, 8:00 a 20:00</small>
      </section>
      <section class="tarjeta">
        <h3>Escribir ahora</h3>
        <button type="button" class="boton boton--primario boton--ancho" data-chat>Abrir chat de soporte</button>
        <small>Respuesta en minutos</small>
      </section>
    </div>
    <p class="nota-pie">Atajos: <kbd>/</kbd> buscar, <kbd>?</kbd> ayuda de la pantalla y <kbd>Esc</kbd> cerrar ventanas.</p>
    <form id="f-soporte" data-propio novalidate>
      <label class="campo"><span>Asunto</span>
        <input type="text" name="asunto" placeholder="Ej.: no puedo abrir un expediente" required
               data-mensaje="Escribe un asunto breve para tu consulta."></label>
      <label class="campo"><span>Descripción del problema</span>
        <textarea name="descripcion" required minlength="10"
                  data-mensaje="Cuéntanos qué ocurrió con al menos 10 caracteres."></textarea></label>
      <div class="modal__acciones">
        <button type="button" class="boton" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton--primario">Enviar consulta</button>
      </div>
    </form>`,
  init(d) {
    d.querySelector('[data-chat]').addEventListener('click', () => toast('Chat de soporte: un asesor te atenderá en unos minutos (simulación).', 'info'));
    const form = d.querySelector('#f-soporte');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) return;
      toast('Consulta enviada. Te responderemos por correo en menos de 24 horas.', 'ok');
      d.close('listo');
    });
  },
};
