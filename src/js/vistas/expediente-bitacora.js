// Vista: Expediente – Bitácora y estado actualizado (wireframe W-17)
import { expedienteHeader } from '../componentes/expediente.js';
import '../../styles/vistas/expediente-bitacora.css';

export default {
  render: (ctx) => `
        <div class="pagina v-expediente-bitacora">
${expedienteHeader('Bitácora', ctx)}
            <p class="estado-nuevo">Estado actualizado: Rechazado y derivado a Legal. Decisión registrada por el analista.</p>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
                    <tbody>
                        <tr class="seleccionada"><td>dd/mm hh:mm</td><td>Analista</td><td>Decisión</td><td>Rechazo con justificación</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Analista</td><td>Escalamiento</td><td>Apoyo solicitado a superior</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Analista</td><td>Consulta de listas</td><td>Cruce de sancionados</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Sistema</td><td>Alerta</td><td>Documento faltante</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Sistema</td><td>Asignación</td><td>Caso asignado al analista</td></tr>
                    </tbody>
                </table>
            </section>
            <p class="nota-pie">Registro protegido: el registro de auditoría no puede modificarse · <a href="#/historial">Ver historial de decisiones</a></p>
        </div>
`,
};
