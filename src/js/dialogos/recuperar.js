// Ventana: Recuperar contraseña (wireframe W-02)
import { validarFormulario } from '../nucleo/formularios.js';
import { anunciar } from '../nucleo/avisos.js';

export default {
  titulo: () => 'Recuperar contraseña',
  ancho: 520,
  render: () => `
    <form id="f-recuperar" data-propio novalidate>
      <p class="dialogo__texto">Ingresa el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.</p>
      <label class="campo"><span>Correo electrónico</span>
        <input type="email" name="correo" placeholder="nombre@empresa.com" autocomplete="email" required
               data-mensaje="Escribe el correo de tu cuenta, por ejemplo nombre@empresa.com."></label>
      <p class="confirmacion" id="confirmacion" role="status" hidden>Enlace enviado. Revisa tu correo.</p>
      <div class="modal__acciones">
        <button type="button" class="boton" data-cerrar>Volver al inicio de sesión</button>
        <button type="submit" class="boton boton--primario">Enviar enlace</button>
      </div>
    </form>`,
  init(d) {
    const form = d.querySelector('#f-recuperar');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) return;
      d.querySelector('#confirmacion').hidden = false;
      anunciar('Enlace enviado. Revisa tu correo.');
      form.querySelector('[type="submit"]').textContent = 'Reenviar enlace';
    });
  },
};
