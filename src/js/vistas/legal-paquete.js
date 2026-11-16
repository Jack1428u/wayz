// Vista: Paquete certificado para SBS e Indecopi (wireframe W-33)
import '../../styles/vistas/legal-paquete.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-paquete">
            <p class="migas">Área legal › Riesgo y paquetes › RCL-2041</p>
            <h1 class="pagina__titulo">Paquete para SBS e Indecopi</h1>
            <div class="paquete">
                <section class="tarjeta">
                    <h2>Documentos del expediente</h2>
                    <label class="casilla"><input type="checkbox" checked> Informe del siniestro</label>
                    <label class="casilla"><input type="checkbox" checked> Fotos del vehículo</label>
                    <label class="casilla"><input type="checkbox" checked> Dictamen firmado</label>
                    <label class="casilla"><input type="checkbox" checked> Acuse de notificación</label>
                    <label class="casilla"><input type="checkbox"> Transcripción de llamada</label>
                    <label class="casilla"><input type="checkbox" checked> Peritaje</label>
                </section>
                <div>
                    <label class="campo campo--destino"><span>Destino</span><select><option>SBS</option><option>Indecopi</option></select></label>
                    <section class="tarjeta indice">
                        <h2>Índice del expediente (vista previa)</h2>
                        <p>1. Informe del siniestro ....... p. 1</p><p>2. Fotos del vehículo ....... p. 6</p>
                        <p>3. Dictamen firmado ....... p. 14</p><p>4. Acuse de notificación ....... p. 18</p>
                    </section>
                    <a class="boton boton--primario boton--ancho" href="#/legal/expediente" data-generar>Generar Expediente Certificado</a>
                </div>
            </div>
        </div>
`,
};
