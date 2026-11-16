// Vista: Antecedentes de arbitrajes y procesos (wireframe W-31)
import '../../styles/vistas/legal-riesgo.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-riesgo">
            <p class="migas">Área legal › Riesgo y paquetes</p>
            <h1 class="pagina__titulo">Antecedentes judiciales y arbitrales</h1>
            <form class="filtros" novalidate>
                <select><option>Tipo</option></select><select><option>Resultado</option></select><select><option>Materia</option></select>
            </form>
            <div class="procesos">
                <section class="tarjeta">
                    <table class="tabla">
                        <thead><tr><th>Proceso</th><th>Tipo</th><th>Materia</th><th>Resultado</th><th>Año</th></tr></thead>
                        <tbody>
                            <tr class="seleccionada"><td><a href="#/legal/riesgo/calculadora">EXP-0001</a></td><td>Arbitraje</td><td>Rechazo de cobertura</td><td>Ganado</td><td>2025</td></tr>
                            <tr><td><a href="#/legal/riesgo/calculadora">EXP-0002</a></td><td>Judicial</td><td>Plazo de respuesta</td><td>Perdido</td><td>2025</td></tr>
                            <tr><td><a href="#/legal/riesgo/calculadora">EXP-0003</a></td><td>Judicial</td><td>Rechazo de cobertura</td><td>Ganado</td><td>2024</td></tr>
                            <tr><td><a href="#/legal/riesgo/calculadora">EXP-0004</a></td><td>Arbitraje</td><td>Monto indemnizado</td><td>Perdido</td><td>2024</td></tr>
                            <tr><td><a href="#/legal/riesgo/calculadora">EXP-0005</a></td><td>Judicial</td><td>Nulidad de póliza</td><td>Ganado</td><td>2023</td></tr>
                        </tbody>
                    </table>
                </section>
                <aside class="tarjeta">
                    <h2>Resultados</h2>
                    <div class="dona"><span>60 %</span></div>
                    <p class="nota-pie">Ganados sobre el total</p>
                </aside>
            </div>
        </div>
`,
};
