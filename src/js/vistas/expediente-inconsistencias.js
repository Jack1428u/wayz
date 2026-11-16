// Vista: Expediente – Inconsistencias (wireframe W-10)
import { expedienteHeader } from '../componentes/expediente.js';
import '../../styles/vistas/expediente-inconsistencias.css';

export default {
  render: (ctx) => `
        <div class="pagina v-expediente-inconsistencias">
${expedienteHeader('Inconsistencias', ctx)}
            <h2 class="subtitulo-seccion">Se detectaron 4 posibles inconsistencias</h2>
            <div class="incons">
                <div>
                    <ul class="lista-incons">
                    <li><span class="icono-doc">▤</span><div><b>Fecha del hecho posterior a la denuncia</b><small>Gravedad alta</small></div><span class="etiqueta etiqueta--rojo">Alta</span></li>
                    <li><span class="icono-doc">▤</span><div><b>Monto reclamado mayor al valor asegurado</b><small>Gravedad alta</small></div><span class="etiqueta etiqueta--rojo">Alta</span></li>
                    <li><span class="icono-doc">▤</span><div><b>Facturas con importes repetidos</b><small>Gravedad media</small></div><span class="etiqueta etiqueta--ambar">Media</span></li>
                    <li><span class="icono-doc">▤</span><div><b>Dirección distinta en dos documentos</b><small>Gravedad baja</small></div><span class="etiqueta etiqueta--verde">Baja</span></li>
                    </ul>
                    <div class="acciones-incons">
                        <a class="boton" href="#/expediente/RCL-2041/documentos">Ver evidencia</a>
                        <button type="button" class="boton" data-accion>Marcar revisada</button>
                    </div>
                </div>

                <div class="columna-graficos">
                    <section class="tarjeta">
                        <h2>Montos facturados por mes</h2>
                        <div class="barras"><div class="barra" style="height: 30%"></div><div class="barra" style="height: 38%"></div><div class="barra" style="height: 28%"></div><div class="barra barra--pico" style="height: 100%"></div><div class="barra" style="height: 34%"></div><div class="barra" style="height: 32%"></div><div class="barra" style="height: 42%"></div></div>
                        <small>Pico inusual en el 4.º mes</small>
                    </section>
                    <section class="tarjeta">
                        <h2>Fechas clave</h2>
                        <div class="fechas">
                            <span></span><span></span><span class="sospechosa"></span><span></span>
                        </div>
                        <p class="fechas__texto">Fecha sospechosa</p>
                    </section>
                </div>
            </div>
        </div>
`,
};
