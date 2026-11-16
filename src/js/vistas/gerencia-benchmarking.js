// Vista: Benchmarking competitivo (radar) (wireframe W-35)
import '../../styles/vistas/gerencia-benchmarking.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-benchmarking">
            <h1 class="pagina__titulo">Benchmarking frente al mercado</h1>
            <form class="filtros" novalidate>
                <select><option>Periodo: 2026</option></select><select><option>Ramo: Todos</option></select>
            </form>
            <div class="radar">
                <section class="tarjeta">
                    <h2>Empresa vs. sector</h2>
                    <svg viewBox="0 0 200 200" role="img" aria-label="Radar de indicadores"><polygon points="100.0,20.0 30.7,60.0 30.7,140.0 100.0,180.0 169.3,140.0 169.3,60.0" class="r-gris"/><polygon points="100.0,36.0 44.6,68.0 44.6,132.0 100.0,164.0 155.4,132.0 155.4,68.0" class="r-empresa"/><polygon points="100.0,48.0 55.0,74.0 55.0,126.0 100.0,152.0 145.0,126.0 145.0,74.0" class="r-sector"/><polygon points="100.0,62.0 67.1,81.0 67.1,119.0 100.0,138.0 132.9,119.0 132.9,81.0" class="r-gris"/><polygon points="100.0,76.0 79.2,88.0 79.2,112.0 100.0,124.0 120.8,112.0 120.8,88.0" class="r-gris"/></svg>
                    <p class="nota">Línea continua: empresa · Línea punteada: sector</p>
                </section>
                <section class="tarjeta">
                    <table class="tabla">
                        <thead><tr><th>Indicador</th><th>Empresa</th><th>Sector</th><th>Brecha</th></tr></thead>
                        <tbody>
                        <tr class="seleccionada"><td>Tiempo de respuesta</td><td>0</td><td>0</td><td>–</td></tr>
                        <tr><td>Detección de fraude</td><td>0</td><td>0</td><td>+</td></tr>
                        <tr><td>Costo por siniestro</td><td>0</td><td>0</td><td>–</td></tr>
                        <tr><td>Satisfacción</td><td>0</td><td>0</td><td>+</td></tr>
                        <tr><td>Ratio de rechazo</td><td>0</td><td>0</td><td>–</td></tr>
                        </tbody>
                    </table>
                    <p class="nota"><a href="#/gerencia/terceros">Ver peritos y estudios jurídicos →</a></p>
                </section>
            </div>
        </div>
`,
};
