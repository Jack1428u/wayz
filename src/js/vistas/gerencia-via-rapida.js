// Vista: Vía rápida para el cliente honesto (wireframe W-40)
import '../../styles/vistas/gerencia-via-rapida.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-via-rapida">
            <p class="migas">Gerencia › Automatización y cliente</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Vía rápida para el cliente honesto</h1>
                <button type="button" class="boton boton--primario" data-accion>Guardar cambios</button>
            </div>
            <div class="via">
                <div>
                    <section class="tarjeta">
                        <h2>Criterios de elegibilidad</h2>
                        <div class="fila">
                            <label class="campo"><span>Antigüedad mínima</span><select><option>2 años</option><option>3 años</option><option>5 años</option></select></label>
                            <label class="campo"><span>Siniestros previos (máx.)</span><input type="number" value="1" min="0"></label>
                        </div>
                        <label class="casilla"><input type="checkbox" checked> Sin alertas de fraude históricas</label>
                        <label class="casilla"><input type="checkbox" checked> Pagos de prima al día</label>
                    </section>
                    <section class="tarjeta beneficios">
                        <h2>Beneficios</h2>
                        <label class="interruptor interruptor--fila">Reducir inspecciones <input type="checkbox" checked></label>
                        <label class="interruptor interruptor--fila">Atención con prioridad <input type="checkbox" checked></label>
                        <label class="interruptor interruptor--fila">Trámite simplificado <input type="checkbox"></label>
                    </section>
                </div>
                <section class="tarjeta">
                    <h2>Asegurados elegibles</h2>
                    <div class="total"><small>Asegurados que califican</small><strong>0 000</strong></div>
                    <ul class="lista-asegurados">
                        <li><span class="icono-doc">▤</span><div><b>Asegurado 1</b><small>2 años · 0 siniestros</small></div></li>
                        <li><span class="icono-doc">▤</span><div><b>Asegurado 2</b><small>3 años · 1 siniestro</small></div></li>
                        <li><span class="icono-doc">▤</span><div><b>Asegurado 3</b><small>5 años · 0 siniestros</small></div></li>
                    </ul>
                </section>
            </div>
            <p class="nota-pie"><a href="#/gerencia/encuesta">Ver encuesta de satisfacción →</a></p>
        </div>
`,
};
