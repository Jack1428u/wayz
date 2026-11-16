// Vista: ROI y presupuesto de reservas (wireframe W-34)
import '../../styles/vistas/gerencia-roi.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-roi">
            <div class="encabezado">
                <h1 class="pagina__titulo">ROI y reservas</h1>
                <a class="boton" href="#/gerencia/benchmarking">Exportar reporte</a>
            </div>
            <div class="kpis">
                <div class="kpi kpi--azul"><span>Costo del sistema</span><strong>S/ 0.0 mil</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Ahorro estimado</span><strong>S/ 0.0 mil</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Retorno (ROI)</span><strong>0 %</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                <div class="kpi kpi--azul"><span>Reserva comprometida</span><strong>S/ 0.0 M</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
            </div>
            <div class="graficos">
                <section class="tarjeta">
                    <h2>Retorno de inversión por mes</h2>
                    <svg class="grafico" viewBox="0 0 290 110" role="img" aria-label="Línea de retorno de inversión">
                        <defs><linearGradient id="rel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563eb" stop-opacity="0.25"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs>
                        <line class="eje" x1="4" x2="290" y1="105" y2="105"/><line class="eje" x1="4" x2="4" y1="2" y2="105"/>
                        <path d="M10,92 C19,90 45,82 62,78 C79,74 97,67 114,66 C131,65 149,73 166,70 C183,67 201,56 218,48 C235,40 261,28 270,24 L270,105 L10,105 Z" fill="url(#rel)"/>
                        <path class="linea" d="M10,92 C19,90 45,82 62,78 C79,74 97,67 114,66 C131,65 149,73 166,70 C183,67 201,56 218,48 C235,40 261,28 270,24"/>
                        <g class="puntos"><circle cx="10" cy="92" r="2.5"/><circle cx="62" cy="78" r="2.5"/><circle cx="114" cy="66" r="2.5"/><circle cx="166" cy="70" r="2.5"/><circle cx="218" cy="48" r="2.5"/><circle cx="270" cy="24" r="2.5"/></g>
                    </svg>
                    <p class="nota">Últimos 6 meses</p>
                </section>
                <section class="tarjeta">
                    <h2>Reserva comprometida por estado</h2>
                    <div class="barras">
                        <div class="barra barra--pico" style="height: 100%"></div><div class="barra" style="height: 66%"></div>
                        <div class="barra" style="height: 40%"></div><div class="barra" style="height: 20%"></div>
                    </div>
                    <p class="nota">Investigación · Legal · Pago · Cierre</p>
                </section>
            </div>
        </div>
`,
};
