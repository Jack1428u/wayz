// Vista: Expediente legal: custodia, versiones y plazo (wireframe W-22)
import '../../styles/vistas/legal-expediente.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-expediente">
            <p class="migas">Área legal › Evidencia</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Expediente legal RCL-2041</h1>
                <a class="boton boton--primario" href="#/legal/dictamen">Ir al dictamen</a>
            </div>
            <div class="legal">
                <section class="tarjeta plazo">
                    <h2>Plazo legal</h2>
                    <div class="dona"><span>18 días</span></div>
                    <p class="nota-pie">Quedan 18 de 30 días</p>
                    <div class="plazo__botones">
                        <button type="button" class="boton" data-accion>Pausar</button><button type="button" class="boton" data-accion>Reanudar</button><button type="button" class="boton" data-dialog="plazo">Extender</button>
                    </div>
                </section>
                <div>
                    <h2 class="subtitulo-seccion">Evidencias con custodia</h2>
                    <section class="tarjeta">
                        <table class="tabla">
                            <thead><tr><th>Documento</th><th>Sello de tiempo</th><th>Huella</th><th>Custodia</th></tr></thead>
                            <tbody>
                            <tr><td>Informe.pdf</td><td>dd/mm hh:mm:ss</td><td>a3f9…</td><td>Inalterable</td></tr>
                            <tr><td>Fotos.zip</td><td>dd/mm hh:mm:ss</td><td>7c2e…</td><td>Inalterable</td></tr>
                            <tr><td><a href="#/legal/audio">Audio.mp3</a></td><td>dd/mm hh:mm:ss</td><td>b81d…</td><td>Inalterable</td></tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="tarjeta versiones">
                        <h2>Versiones – Informe.pdf</h2>
                        <table class="tabla">
                            <thead><tr><th>Versión</th><th>Modificó</th><th>Fecha</th><th>Cambio</th></tr></thead>
                            <tbody>
                            <tr><td>v3</td><td>Asesor legal</td><td>dd/mm</td><td>Dictamen</td></tr>
                            <tr><td>v2</td><td>Analista 1</td><td>dd/mm</td><td>Anexo</td></tr>
                            <tr><td>v1</td><td>Sistema</td><td>dd/mm</td><td>Carga</td></tr>
                            </tbody>
                        </table>
                        <a class="boton boton--derecha" href="#/legal/visor">Ver cambios</a>
                    </section>
                </div>
            </div>
        </div>
`,
};
