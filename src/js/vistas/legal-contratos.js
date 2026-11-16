// Vista: Contrato traducido en pantalla dividida (wireframe W-26)
import '../../styles/vistas/legal-contratos.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-contratos">
            <p class="migas">Área legal › Contratos</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Contrato de reaseguro internacional</h1>
                <a class="boton boton--primario" href="#/legal/contratos/mapa">Ver mapa de calor</a>
            </div>
            <form class="idiomas" novalidate>
                <select><option>Inglés</option></select><span>→</span><select><option>Español</option></select>
                <label class="casilla"><input type="checkbox" checked> Mantener formato original</label>
            </form>
            <div class="contrato">
                <section>
                    <h2 class="rotulo">Original (inglés)</h2>
                    <article class="tarjeta texto-contrato" tabindex="0" role="region" aria-label="Texto original del contrato, en inglés">
                        <h3>Article 4 – Retrocession</h3>
                        <p>Under the terms of this International Reinsurance Agreement, the Reinsurer reserves the express right to retrocede, transfer or cede a portion of the risks assumed under this policy to qualified international retrocessionaires[1][2]. Such retrocession arrangements shall not alter, diminish, or discharge the primary obligations and liabilities of the Reinsurer toward the Reinsured, remaining fully bound to settle and indemnify all valid claims in accordance with the agreed terms, conditions, and coverage limits specified in the underlying contractual clauses[1][3].</p>
                        <p>In the event of a retroceded loss or claim, the Reinsurer shall notify the retrocessionaires in accordance with established reporting timelines and protocols, ensuring complete documentation, loss adjustment records, and forensic evidence are properly transmitted[1][2]. The retrocessionaire shall indemnify the Reinsurer for its proportionate share of settled claims, provided that all premium payments, breach notifications, and policy exclusions under this Agreement are strictly observed and maintained throughout the policy period.</p>
                    </article>
                </section>
                <section>
                    <h2 class="rotulo">Traducción (español)</h2>
                    <article class="tarjeta texto-contrato" tabindex="0" role="region" aria-label="Traducción del contrato, en español">
                        <h3>Artículo 4 – Retrocesión</h3>
                        <p>Bajo los términos del presente Contrato de Reaseguro Internacional, el Reasegurador se reserva el derecho expreso de retroceder, transferir o ceder una parte de los riesgos asumidos bajo esta póliza a retrocesionarios internacionales cualificados[1][2]. Dichos acuerdos de retrocesión no alterarán, disminuirán ni eximirán las obligaciones y responsabilidades primarias del Reasegurador frente al Reasegurado, manteniéndose plenamente obligado a liquidar e indemnizar todos los reclamos válidos de conformidad con los términos, condiciones y límites de cobertura acordados en las cláusulas contractuales subyacentes[1][3].</p>
                        <p>En caso de pérdida o reclamo objeto de retrocesión, el Reasegurador notificará a los retrocesionarios de acuerdo con los plazos e instrucciones de reporte establecidos, garantizando la debida transmisión de la documentación completa, registros de ajuste de pérdidas y evidencias periciales[1][2]. El retrocesionario indemnizará al Reasegurador en la proporción correspondiente de los reclamos liquidados, siempre que los pagos de prima, notificaciones de incumplimiento y exclusiones de la póliza estipuladas en este Contrato hayan sido estrictamente observados y mantenidos durante la vigencia del mismo.</p>
                    </article>
                </section>
            </div>
        </div>
`,
};
