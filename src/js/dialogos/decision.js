// Ventana: Decisión del caso (wireframe W-14). Acción crítica: pide confirmación antes de registrarla.
import { trabajo } from '../nucleo/almacen.js';
import { validarFormulario, marcarError, limpiarError } from '../nucleo/formularios.js';
import { confirmar } from '../nucleo/dialogo.js';
import { toast } from '../nucleo/avisos.js';
import { registrarDecision } from '../datos/repositorio.js';

const TEXTO = { aprobar: 'Aprobado', rechazar: 'Rechazado', legal: 'Derivado a Legal' };

export default {
  titulo: () => `Registrar decisión del caso ${trabajo.casoActual}`,
  ancho: 560,
  render: () => `
    <form id="f-decision" data-propio novalidate>
      <fieldset class="grupo">
        <legend>Decisión</legend>
        <div class="radios">
          <label><input type="radio" name="decision" value="aprobar"> Aprobar el pago</label>
          <label><input type="radio" name="decision" value="rechazar"> Rechazar</label>
          <label><input type="radio" name="decision" value="legal"> Derivar a Legal</label>
        </div>
      </fieldset>
      <label class="campo"><span>Justificación (obligatoria)</span>
        <textarea name="motivo" placeholder="Describe el motivo de la decisión…" required minlength="10"
                  data-mensaje="Explica el motivo de la decisión en al menos 10 caracteres."></textarea></label>
      <p class="nota-pie">Se registrará con fecha, hora y usuario en la bitácora.</p>
      <fieldset class="reglas">
        <legend>Reglas del sistema</legend>
        <label class="casilla"><input type="checkbox" name="falsa"> Marcar como falsa alarma (ajustar reglas)</label>
        <label class="campo"><span>Motivo de la falsa alarma</span>
          <select name="motivoFalsa" disabled><option value="legitimo">Caso legítimo</option><option value="datos">Error de datos</option><option value="otro">Otro</option></select></label>
      </fieldset>
      <div class="modal__acciones">
        <button type="button" class="boton" data-cerrar>Cancelar</button>
        <button type="submit" class="boton boton--primario">Confirmar decisión</button>
      </div>
    </form>`,
  init(d, ctx) {
    const form = d.querySelector('#f-decision');
    form.falsa.addEventListener('change', () => (form.motivoFalsa.disabled = !form.falsa.checked));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Los radios comparten nombre: se comprueba el grupo completo, después de validar el resto.
      const elegido = form.decision.value;
      const resto = validarFormulario(form);
      if (!elegido) {
        marcarError(form.decision[0], 'Elige una decisión: aprobar, rechazar o derivar a Legal.');
        form.decision[0].focus();
      } else limpiarError(form.decision[0]);
      if (!resto || !elegido) return;
      const si = await confirmar({
        titulo: '¿Confirmar la decisión?',
        mensaje: `Vas a registrar «${TEXTO[elegido]}» para el caso ${trabajo.casoActual}. Quedará guardado en la bitácora y no se puede deshacer desde esta pantalla.`,
        aceptar: 'Sí, registrar',
      });
      if (!si) return;
      const registro = { tipo: TEXTO[elegido], motivo: form.motivo.value.trim(), caso: trabajo.casoActual };
      try {
        await registrarDecision({ ...registro, falsaAlarma: form.falsa.checked });
      } catch (err) {
        toast(`No se pudo guardar la decisión: ${err.message}`, 'alerta');
        return;
      }
      trabajo.decision = registro;
      toast(`Decisión registrada: ${TEXTO[elegido]}.`, 'ok');
      d.close('listo');
      location.hash = `#/expediente/${trabajo.casoActual}/bitacora`;
    });
  },
};
