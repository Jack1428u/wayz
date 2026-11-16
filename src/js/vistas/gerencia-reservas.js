// Vista: Seguimiento SCTR y Vida en tiempo real (wireframe W-37)
import '../../styles/vistas/gerencia-reservas.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-reservas">
            <p class="migas">Gerencia › Reservas y reportes</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">SCTR y Vida en tiempo real</h1>
                <small>Actualizado hace 3 s</small>
            </div>
            <div class="kpis">
                <div class="kpi kpi--azul"><span>Solicitudes abiertas</span><strong>31</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Dentro de plazo</span><strong>27</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Fuera de plazo</span><strong>4</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
            </div>
            <div class="segmentos" role="group" aria-label="Filtro"><button type="button" class="boton boton--primario" data-segmento="Todas" aria-pressed="true">Todas</button><button type="button" class="boton" data-segmento="SCTR" aria-pressed="false">SCTR</button><button type="button" class="boton" data-segmento="Vida" aria-pressed="false">Vida</button></div>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Solicitud</th><th>Cobertura</th><th>Trabajador / asegurado</th><th>Estado</th><th>Plazo</th></tr></thead>
                    <tbody>
                    <tr><td>SOL-310</td><td>SCTR</td><td>Trabajador 1</td><td>Atención médica</td><td>En plazo</td></tr>
                    <tr><td>SOL-309</td><td>Vida</td><td>Asegurado 2</td><td>En evaluación</td><td>En plazo</td></tr>
                    <tr><td>SOL-307</td><td>SCTR</td><td>Trabajador 3</td><td>Documentos pendientes</td><td><span class="etiqueta etiqueta--ambar">Por vencer</span></td></tr>
                    <tr class="seleccionada"><td>SOL-301</td><td>SCTR</td><td>Trabajador 4</td><td>Atención médica</td><td>Fuera de plazo</td></tr>
                    <tr><td>SOL-298</td><td>Vida</td><td>Asegurado 5</td><td>Pago en proceso</td><td>En plazo</td></tr>
                    </tbody>
                </table>
            </section>
            <p class="nota-pie"><a href="#/gerencia/reportes">Ver reportes regulatorios programados →</a></p>
        </div>
`,
};
