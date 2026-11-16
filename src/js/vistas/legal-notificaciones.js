// Vista: Notificaciones y acuses de recibo (wireframe W-30)
import '../../styles/vistas/legal-notificaciones.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-notificaciones">
            <p class="migas">Área legal › Dictamen y plazos</p>
            <h1 class="pagina__titulo">Notificaciones y acuses</h1>
            <div class="kpis">
                <div class="kpi kpi--azul"><span>Enviadas</span><strong>12</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Con acuse de recibo</span><strong>9</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Pendientes de acuse</span><strong>3</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
            </div>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Caso</th><th>Destinatario</th><th>Canal</th><th>Enviada</th><th>Acuse</th><th>Acción</th></tr></thead>
                    <tbody>
                        <tr class="seleccionada"><td>RCL-2041</td><td>Reclamante A</td><td>Carta notarial</td><td>dd/mm</td><td><span class="etiqueta etiqueta--ambar">Pendiente</span></td><td><button type="button" class="enlace-boton" data-accion>Reenviar</button></td></tr>
                        <tr><td>RCL-2019</td><td>Reclamante B</td><td>Correo certificado</td><td>dd/mm</td><td>Recibido</td><td><button type="button" class="enlace-boton" data-accion>Constancia</button></td></tr>
                        <tr><td>RCL-1987</td><td>Reclamante C</td><td>Carta notarial</td><td>dd/mm</td><td>Recibido</td><td><button type="button" class="enlace-boton" data-accion>Constancia</button></td></tr>
                        <tr><td>RCL-1904</td><td>Reclamante D</td><td>Correo certificado</td><td>dd/mm</td><td><span class="etiqueta etiqueta--ambar">Pendiente</span></td><td><button type="button" class="enlace-boton" data-accion>Reenviar</button></td></tr>
                        <tr><td>RCL-1855</td><td>Reclamante E</td><td>Carta notarial</td><td>dd/mm</td><td>Recibido</td><td><button type="button" class="enlace-boton" data-accion>Constancia</button></td></tr>
                    </tbody>
                </table>
            </section>
            <p class="nota-pie"><a href="#/legal/riesgo">Ver riesgo y paquetes →</a></p>
        </div>
`,
};
