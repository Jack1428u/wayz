// Vista: Visor comparativo con lupa y anotaciones (wireframe W-24)
import '../../styles/vistas/legal-visor.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-visor">
            <p class="migas">Área legal › Evidencia › RCL-2041</p>
            <h1 class="pagina__titulo">Visor comparativo</h1>
            <div class="herramientas" role="group" aria-label="Filtro">
                <button type="button" class="boton" data-segmento="Lupa" aria-pressed="false">Lupa</button><button type="button" class="boton" data-segmento="Resaltar" aria-pressed="false">Resaltar</button>
                <button type="button" class="boton boton--primario" data-segmento="Nota" aria-pressed="true">Nota</button><button type="button" class="boton" data-segmento="Etiqueta" aria-pressed="false">Etiqueta</button>
            </div>
            <div class="visor-doble">
                <div>
                    <h2 class="rotulo">Reclamo presentado</h2>
                    <div class="hoja">
                        <div class="lupa">×3</div>
                        <p class="nota-adhesiva">Nota: la fecha no coincide con el certificado.</p>
                    </div>
                </div>
                <div>
                    <h2 class="rotulo">Certificado oficial guardado</h2>
                    <div class="hoja hoja--vacia"></div>
                </div>
                <section class="tarjeta anotaciones">
                    <h2>Anotaciones (3)</h2>
                    <p>Fecha inconsistente</p><p>Firma distinta</p><p>Sello ilegible</p>
                </section>
            </div>
            <p class="nota-pie"><a href="#/legal/expediente">← Volver al expediente legal</a></p>
        </div>
`,
};
