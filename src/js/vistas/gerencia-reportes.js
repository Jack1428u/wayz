// Vista: Reportes regulatorios programados (wireframe W-41)
import '../../styles/vistas/gerencia-reportes.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-reportes">
            <p class="migas">Gerencia › Reservas y reportes</p>
            <h1 class="pagina__titulo">Reportes regulatorios</h1>
            <div class="regulatorios">
                <div>
                    <section class="tarjeta">
                        <table class="tabla">
                            <thead><tr><th>Reporte</th><th>Regulador</th><th>Periodicidad</th></tr></thead>
                            <tbody>
                            <tr class="seleccionada"><td>Siniestros</td><td>SBS</td><td>Mensual</td></tr>
                            <tr><td>Reclamos</td><td>Indecopi</td><td>Trimestral</td></tr>
                            <tr><td>Reservas</td><td>SBS</td><td>Mensual</td></tr>
                            </tbody>
                        </table>
                        <p class="aviso-punteado">Envío programado: Siniestros, mensual, día 5.</p>
                    </section>
                </div>
                <form class="tarjeta" id="f-reporte" data-propio novalidate>
                    <h2>Programar envío automático</h2>
                    <div class="fila">
                        <label class="campo"><span>Periodicidad</span><select><option>Mensual</option><option>Trimestral</option></select></label>
                        <label class="campo"><span>Día de envío</span><select><option>Día 5</option></select></label>
                    </div>
                    <label class="campo"><span>Destinatario</span><input type="email" name="destinatario" placeholder="correo del regulador" required data-mensaje="Escribe el correo del regulador, por ejemplo reportes@sbs.gob.pe."></label>
                    <label class="campo campo--medio"><span>Formato</span><select><option>PDF</option><option>Excel</option></select></label>
                    <button type="submit" class="boton boton--primario boton--programar">Programar envío</button>
                </form>
            </div>
            <h2 class="subtitulo-seccion">Estado de los reportes enviados</h2>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Reporte</th><th>Fecha de envío</th><th>Destinatario</th><th>Estado</th></tr></thead>
                    <tbody>
                        <tr><td>Siniestros – mes anterior</td><td>dd/mm</td><td>SBS</td><td><span class="etiqueta etiqueta--verde">Enviado</span></td></tr>
                        <tr><td>Reclamos – trimestre anterior</td><td>dd/mm</td><td>Indecopi</td><td><span class="etiqueta etiqueta--verde">Enviado</span></td></tr>
                        <tr><td>Reservas – mes en curso</td><td>dd/mm</td><td>SBS</td><td>Programado</td></tr>
                    </tbody>
                </table>
            </section>
            <p class="nota-pie"><a href="#/gerencia">← Volver a ROI y reservas</a></p>
        </div>
`,
};
