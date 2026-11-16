// Vista: Carga del equipo y redistribución de casos (wireframe W-38)
import '../../styles/vistas/gerencia-equipo.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-equipo">
            <p class="migas">Gerencia › Equipo y carga</p>
            <h1 class="pagina__titulo">Carga del equipo</h1>
            <div class="equipo">
                <section>
                    <h2 class="subtitulo-seccion">Carga por analista</h2>
                    <div class="analista"><span>Analista 1<br><span class="etiqueta etiqueta--gris">Sobrecargado</span></span><div class="progreso"><div style="width: 95%"></div></div><b>19 casos</b></div>
                    <div class="analista"><span>Analista 2</span><div class="progreso"><div style="width: 70%"></div></div><b>14 casos</b></div>
                    <div class="analista"><span>Analista 3</span><div class="progreso"><div style="width: 45%"></div></div><b>9 casos</b></div>
                    <div class="analista"><span>Analista 4</span><div class="progreso"><div style="width: 30%"></div></div><b>6 casos</b></div>
                </section>
                <section class="tarjeta">
                    <h2>Redistribuir casos pendientes</h2>
                    <p class="desde">Desde: Analista 1</p>
                    <label class="casilla"><input type="checkbox" checked> RCL-2052 · Medio</label>
                    <label class="casilla"><input type="checkbox" checked> RCL-2047 · Medio</label>
                    <label class="casilla"><input type="checkbox"> RCL-2033 · Bajo</label>
                    <label class="casilla"><input type="checkbox"> RCL-2029 · Bajo</label>
                    <label class="campo"><span>Hacia</span><select><option>Analista 4</option><option>Analista 3</option></select></label>
                    <button type="button" class="boton boton--primario boton--ancho" id="reasignar">Reasignar 2 casos</button>
                </section>
            </div>
        </div>
`,
};
