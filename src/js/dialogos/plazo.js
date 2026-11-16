// Ventana: Pausar o extender el plazo legal (wireframe W-23)
import { trabajo } from '../nucleo/almacen.js';
import { validarFormulario } from '../nucleo/formularios.js';
import { toast } from '../nucleo/avisos.js';
import { cambiarPlazo } from '../datos/repositorio.js';
import { hayBaseDeDatos } from '../datos/supabase.js';

const TOTAL_BASE = 30;

export default {
  titulo: () => `Plazo legal – ${trabajo.casoActual}`,
  ancho: 500,
  render: () => `
    <form id="f-plazo" data-propio novalidate>
      <fieldset class="grupo">
        <legend>Acción</legend>
        <div class="radios">
          <label><input type="radio" name="accion" value="pausar"> Pausar</label>
          <label><input type="radio" name="accion" value="reanudar"> Reanudar</label>
          <label><input type="radio" name="accion" value="extender" checked> Extender</label>
        </div>
      </fieldset>
      <label class="campo campo--dias"><span>Días a extender</span>
        <input type="number" name="dias" value="5" min="1" max="30" required data-mensaje="Escribe un número de días entre 1 y 30."></label>
      <label class="campo"><span>Justificación (obligatoria)</span>
        <textarea name="motivo" placeholder="Explica el motivo del cambio de plazo…" required minlength="10"
                  data-mensaje="Explica el motivo del cambio (mínimo 10 caracteres)."></textarea></label>
      <p class="nota-pie" id="nuevo-venc" aria-live="polite"></p>
      <div class="modal__acciones">
        <button type="button" class="boton" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton--primario">Aplicar</button>
      </div>
    </form>`,
  init(d) {
    const form = d.querySelector('#f-plazo');
    const nota = d.querySelector('#nuevo-venc');
    const actualizar = () => {
      const extiende = form.accion.value === 'extender';
      form.dias.disabled = !extiende;
      const dias = extiende ? Number(form.dias.value) || 0 : 0;
      nota.textContent = extiende
        ? `Quedarán ${trabajo.plazoLegalDias + dias} días (${TOTAL_BASE + dias} en total).`
        : `El cronómetro quedará ${form.accion.value === 'pausar' ? 'en pausa' : 'en marcha'}.`;
    };
    form.addEventListener('input', actualizar);
    actualizar();
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) return;
      const extiende = form.accion.value === 'extender';
      try {
        await cambiarPlazo({ caso: trabajo.casoActual, accion: form.accion.value, dias: Number(form.dias.value), motivo: form.motivo.value.trim() });
      } catch (err) {
        toast(`No se pudo cambiar el plazo: ${err.message}`, 'alerta');
        return;
      }
      if (extiende && !hayBaseDeDatos) trabajo.plazoLegalDias += Number(form.dias.value);
      window.dispatchEvent(new CustomEvent('wayz:plazo', { detail: { accion: form.accion.value } }));
      toast('Plazo legal actualizado y registrado en la bitácora.', 'ok');
      d.close('listo');
    });
  },
};
