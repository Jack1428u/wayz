// Vista: Aprobación automática de siniestros menores (wireframe W-39)
import '../../styles/vistas/gerencia-automatizacion.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-automatizacion">
            <p class="migas">Gerencia › Automatización y cliente</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Aprobación automática</h1>
                <button type="button" class="boton boton--primario" data-accion>Guardar cambios</button>
            </div>
            <label class="interruptor interruptor--fila">Aprobar siniestros menores automáticamente <input type="checkbox" checked></label>
            <div class="reglas-sim">
                <section class="tarjeta">
                    <h2>Reglas</h2>
                    <label class="campo campo--medio"><span>Monto máximo</span><input type="text" value="S/ 2 000"></label>
                    <p class="rotulo">Ramos permitidos</p>
                    <div class="fila-casillas">
                        <label class="casilla"><input type="checkbox" checked> Vehicular</label>
                        <label class="casilla"><input type="checkbox" checked> Hogar</label>
                        <label class="casilla"><input type="checkbox"> Salud</label>
                    </div>
                    <p class="rotulo">Condiciones obligatorias</p>
                    <label class="casilla"><input type="checkbox" checked> Sin alertas de riesgo</label>
                    <label class="casilla"><input type="checkbox" checked> Sin inconsistencias de datos</label>
                    <label class="casilla"><input type="checkbox" checked> Identidad verificada</label>
                </section>
                <section>
                    <h2 class="subtitulo-seccion">Simulación</h2>
                    <div class="kpi kpi--azul"><span>Casos que cumplirían</span><strong>128 / mes</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                    <div class="kpi kpi--azul"><span>Ahorro operativo estimado</span><strong>S/ 0.0 mil</strong><svg viewBox="0 0 64 26" aria-hidden="true"><polyline points="0,20 12,18 24,22 36,16 48,19 64,12"/></svg></div>
                    <p class="nota-pie">Estos casos se aprobarían sin pasar por la bandeja de los analistas.</p>
                    <p class="nota-pie"><a href="#/gerencia/via-rapida">Ir a «Vía rápida para el cliente honesto» →</a></p>
                </section>
            </div>
        </div>
`,
};
