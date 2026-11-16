// Vista: Centro de comando (wireframe W-04)
import '../../styles/vistas/centro-comando.css';

export default {
  render: (ctx) => `
        <div class="pagina v-centro-comando">
            <div class="encabezado">
                <h1 class="pagina__titulo">Centro de comando</h1>
                <button type="button" class="boton" data-pantalla>Pantalla completa</button>
            </div>

            <div class="kpis">
            <div class="kpi kpi--azul"><span>Cumplimiento de plazos</span><strong>92 %</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,10"/></svg></div>
            <div class="kpi kpi--ambar"><span>Reserva comprometida</span><strong>S/ 1.2 M</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,18 12,14 24,19 36,10 48,16 64,12"/></svg></div>
            <div class="kpi kpi--azul"><span>Casos en investigación</span><strong>37</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,20 24,14 36,18 48,12 64,13"/></svg></div>
            <div class="kpi kpi--azul"><span>Alertas activas</span><strong>3</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,18 12,14 24,19 36,15 48,17 64,12"/></svg></div>
            </div>

            <div class="grafico-y-alertas">
                <section class="tarjeta">
                    <h2>Siniestros por hora (en vivo)</h2>
                    <svg class="grafico" viewBox="0 0 600 290" role="img" aria-label="Línea de siniestros por hora">
                        <defs>
                            <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stop-color="#2563eb" stop-opacity="0.25"/>
                                <stop offset="1" stop-color="#2563eb" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                        <g class="grilla"><line x1="6" x2="600" y1="6" y2="6"/><line x1="6" x2="600" y1="72" y2="72"/><line x1="6" x2="600" y1="139" y2="139"/><line x1="6" x2="600" y1="205" y2="205"/></g>
                        <line class="eje" x1="6" x2="600" y1="271" y2="271"/>
                        <line class="eje" x1="6" x2="6" y1="3" y2="271"/>
                        <path class="area" d="M14,218 C26,216 62,208 86,204 C110,200 134,192 158,191 C182,190 206,198 230,196 C254,194 278,197 302,178 C326,159 350,109 374,84 C398,59 422,26 446,30 C470,34 494,89 518,111 C542,133 578,155 590,164 L590,271 L14,271 Z"/>
                        <path class="linea" d="M14,218 C26,216 62,208 86,204 C110,200 134,192 158,191 C182,190 206,198 230,196 C254,194 278,197 302,178 C326,159 350,109 374,84 C398,59 422,26 446,30 C470,34 494,89 518,111 C542,133 578,155 590,164"/>
                        <g class="puntos"><circle cx="14" cy="218" r="4"/><circle cx="86" cy="204" r="4"/><circle cx="158" cy="191" r="4"/><circle cx="230" cy="196" r="4"/><circle cx="302" cy="178" r="4"/><circle cx="374" cy="84" r="4"/><circle cx="446" cy="30" r="4"/><circle cx="518" cy="111" r="4"/><circle cx="590" cy="164" r="4"/></g>
                    </svg>
                    <p class="nota">Actualizado hace 5 segundos</p>
                </section>

                <aside class="tarjeta">
                    <h2>Alertas recientes</h2>
                    <button type="button" class="alerta alerta--ambar" data-dialog="alerta">Pico de siniestros en la zona sur</button>
                    <button type="button" class="alerta" data-dialog="alerta">Posible red de fraude (4 casos)</button>
                    <button type="button" class="alerta" data-dialog="alerta">Reserva sobre el 80 % del límite</button>
                </aside>
            </div>

            <label class="interruptor">Alertas sonoras <input type="checkbox" checked></label>
        </div>
`,
};
