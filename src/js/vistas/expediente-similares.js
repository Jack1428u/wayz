// Vista: Expediente – Casos similares y redes sospechosas (wireframe W-12)
import { expedienteHeader } from '../componentes/expediente.js';
import '../../styles/vistas/expediente-similares.css';

export default {
  render: (ctx) => `
        <div class="pagina v-expediente-similares">
${expedienteHeader('Similares y redes', ctx)}
            <div class="similares">
                <section class="tarjeta">
                    <select class="filtro"><option>Filtrar por empresa o persona</option></select>
                    <table class="tabla">
                        <thead><tr><th>Caso</th><th>Fecha</th><th>Decisión</th><th>Similitud</th></tr></thead>
                        <tbody>
                            <tr class="seleccionada"><td><a href="#/historial">RCL-1987</a></td><td>06/2026</td><td><span class="etiqueta etiqueta--rojo">Rechazado</span></td><td>92 %</td></tr>
                            <tr><td><a href="#/historial">RCL-1904</a></td><td>mm/aaaa</td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>81 %</td></tr>
                            <tr><td><a href="#/historial">RCL-1855</a></td><td>mm/aaaa</td><td><span class="etiqueta etiqueta--rojo">Rechazado</span></td><td>74 %</td></tr>
                            <tr><td><a href="#/historial">RCL-1790</a></td><td>mm/aaaa</td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>63 %</td></tr>
                            <tr><td><a href="#/historial">RCL-1702</a></td><td>mm/aaaa</td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>55 %</td></tr>
                        </tbody>
                    </table>
                </section>
                <section class="tarjeta">
                    <h2>Red de vínculos</h2>
                    <svg class="red" viewBox="0 0 260 150" role="img" aria-label="Grafo de vínculos entre reclamos">
                        <g stroke="#7b8799" stroke-width="1.3">
                            <line x1="130" y1="22" x2="35" y2="78"/><line x1="130" y1="22" x2="225" y2="78"/>
                            <line x1="130" y1="22" x2="200" y2="125"/><line x1="35" y1="78" x2="70" y2="125"/>
                            <line x1="70" y1="125" x2="200" y2="125"/><line x1="225" y1="78" x2="200" y2="125"/>
                        </g>
                        <circle cx="130" cy="22" r="9" fill="#1d3557"/>
                        <g fill="#fff" stroke="#7b8799" stroke-width="1.5">
                            <circle cx="35" cy="78" r="9"/><circle cx="225" cy="78" r="9"/>
                            <circle cx="70" cy="125" r="9"/><circle cx="200" cy="125" r="9"/>
                        </g>
                    </svg>
                    <p class="aviso-punteado">Alerta: 5 reclamos vinculados por teléfono y dirección en común.</p>
                </section>
            </div>
        </div>
`,
};
