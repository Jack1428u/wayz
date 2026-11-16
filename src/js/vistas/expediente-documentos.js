// Vista: Expediente – Documentos y adjuntos (wireframe W-09)
import { expedienteHeader } from '../componentes/expediente.js';
import '../../styles/vistas/expediente-documentos.css';

export default {
  render: (ctx) => `
        <div class="pagina v-expediente-documentos">
${expedienteHeader('Documentos', ctx)}
            <div class="docs">
                <section class="tarjeta">
                    <h2>Adjuntos (6)</h2>
                    <ul class="lista-adjuntos">
                        <li><span class="icono icono--pdf">PDF</span><div><b>Informe del siniestro.pdf</b><small>PDF · 2 MB</small></div></li>
                        <li><span class="icono icono--zip">ZIP</span><div><b>Fotos del vehículo.zip</b><small>ZIP · 48 MB</small></div></li>
                        <li><span class="icono icono--mp4">MP4</span><div><b>Video de inspección.mp4</b><small>MP4 · 184 MB</small></div></li>
                        <li><span class="icono icono--pdf">PDF</span><div><b>Historia clínica.pdf</b><small>PDF · 5 MB</small></div></li>
                        <li><span class="icono icono--pdf">PDF</span><div><b>Peritaje.pdf</b><small>PDF · 3 MB</small></div></li>
                    </ul>
                    <button type="button" class="boton boton--ancho" data-accion>Subir adjunto</button>
                </section>

                <div class="visor">
                    <div class="visor__buscar">
                        <input type="search" value="cláusula de exclusión" aria-label="Buscar palabras dentro del documento">
                        <span>5 coincidencias ‹ ›</span>
                    </div>
                    <div class="visor__hoja">Vista del documento seleccionado</div>
                    <div class="progreso"><div style="width: 40%"></div></div>
                    <small>Cargando páginas 13–24 de 60 (carga progresiva) · 40 %</small>
                </div>
            </div>
        </div>
`,
};
