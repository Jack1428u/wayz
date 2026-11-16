// Vista: Bandeja legal con plazos (wireframe W-21)
import '../../styles/vistas/legal-bandeja.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-bandeja">
            <h1 class="pagina__titulo">Bandeja legal</h1>
            <div class="kpis">
                <div class="kpi kpi--azul"><span>Casos derivados</span><strong>9</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Vencen en 3 días</span><strong>2</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Plazo pausado</span><strong>1</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Dictámenes firmados</span><strong>14</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
            </div>
            <form class="filtros" novalidate>
                <select><option>Estado</option></select><select><option>Tipo de dictamen</option></select>
            </form>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Caso</th><th>Derivado por</th><th>Plazo legal</th><th>Días restantes</th><th>Estado</th><th>Aviso</th></tr></thead>
                    <tbody>
                            <tr class="seleccionada"><td><a href="#/legal/expediente"><b>RCL-2041</b></a></td><td>Analista 1</td><td>30 días</td><td>2</td><td><span class="etiqueta etiqueta--ambar">En revisión</span></td><td>Vence pronto</td></tr>
                            <tr><td><a href="#/legal/expediente"><b>RCL-2019</b></a></td><td>Analista 3</td><td>30 días</td><td>5</td><td><span class="etiqueta etiqueta--ambar">En revisión</span></td><td>—</td></tr>
                            <tr><td><a href="#/legal/expediente"><b>RCL-1987</b></a></td><td>Analista 2</td><td>30 días</td><td>9</td><td>Pausado</td><td>Plazo detenido</td></tr>
                            <tr><td><a href="#/legal/expediente"><b>RCL-1904</b></a></td><td>Analista 1</td><td>30 días</td><td>14</td><td><span class="etiqueta etiqueta--ambar">En revisión</span></td><td>—</td></tr>
                            <tr><td><a href="#/legal/expediente"><b>RCL-1855</b></a></td><td>Analista 2</td><td>30 días</td><td>21</td><td>Nuevo</td><td>—</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
`,
};
