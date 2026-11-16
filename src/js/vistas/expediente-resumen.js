// Vista: Expediente – Resumen (wireframe W-08)
import { expedienteHeader } from '../componentes/expediente.js';
import '../../styles/vistas/expediente-resumen.css';
import { buscarCaso, formatoMoneda } from '../datos/datos.js';
import { trabajo } from '../nucleo/almacen.js';
import { esc } from '../nucleo/dom.js';
import { tarjetaAgente } from '../componentes/agente.js';

export default {
  render: (ctx) => {
    const c = buscarCaso(ctx.params.caso) ?? trabajo.casosNuevos.find((x) => x.id === ctx.params.caso) ?? buscarCaso('RCL-2041');
    return `
        <div class="pagina v-expediente-resumen">
${expedienteHeader('Resumen', ctx)}
            ${tarjetaAgente(c.id)}
            <div class="dos-iguales">
                <section class="tarjeta">
                    <h2>Datos del caso</h2>
                    <dl class="datos">
                        <dt>Reclamante</dt><dd>${esc(c.reclamante)}</dd>
                        <dt>Póliza</dt><dd>${esc(c.poliza)}</dd>
                        <dt>Tipo</dt><dd>${esc(c.tipo)}</dd>
                        <dt>Fecha del hecho</dt><dd>${esc(c.fecha)}</dd>
                        <dt>Monto estimado</dt><dd>${formatoMoneda(c.monto)}</dd>
                    </dl>
                </section>
                <section class="tarjeta">
                    <h2>Línea de tiempo</h2>
                    <ul class="linea-tiempo">
                        <li>Reclamo registrado</li>
                        <li>Asignado al analista</li>
                        <li>Documentos recibidos</li>
                        <li>En revisión</li>
                    </ul>
                </section>
            </div>

            <div class="falta-doc">
                <span>Falta un documento: «informe de peritaje». Solicítalo al reclamante.</span>
                <button type="button" class="boton boton--primario" data-accion>Solicitar documento</button>
            </div>

            <section class="tarjeta">
                <h2>Resumen generado</h2>
                <p class="resumen">Texto breve con los hallazgos más importantes del caso.</p>
            </section>
        </div>
`;
  },
};
