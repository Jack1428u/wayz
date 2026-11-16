// Vista: Reglas del sistema (wireframe W-44)
import '../../styles/vistas/config-reglas.css';

export default {
  render: (ctx) => `
        <div class="pagina v-config-reglas">
            <div class="encabezado">
                <h1 class="pagina__titulo">Reglas del sistema</h1>
                <a class="boton boton--primario" href="#/centro-comando">Guardar cambios</a>
            </div>
            <div class="reglas">
                <section class="tarjeta">
                    <h2>Recalibración de reglas</h2>
                    <label class="deslizador"><span>Montos atípicos<b>12 falsas alarmas</b></span><input type="range" min="0" max="100" value="60"><small>Sensibilidad: menos alertas ◄—► más alertas</small></label>
                    <label class="deslizador"><span>Fechas sospechosas<b>5 falsas alarmas</b></span><input type="range" min="0" max="100" value="40"><small>Sensibilidad: menos alertas ◄—► más alertas</small></label>
                    <label class="deslizador"><span>Documentos repetidos<b>9 falsas alarmas</b></span><input type="range" min="0" max="100" value="65"><small>Sensibilidad: menos alertas ◄—► más alertas</small></label>
                </section>
                <div>
                    <section class="tarjeta">
                        <h2>Fuentes de verificación</h2>
                        <label class="interruptor interruptor--fila">Consulta de DNI/RUC (servicio oficial) <input type="checkbox" checked></label>
                        <label class="interruptor interruptor--fila">Listas de sancionados (UIF, OFAC) <input type="checkbox" checked></label>
                        <label class="interruptor interruptor--fila">Consulta automática al registrar <input type="checkbox"></label>
                    </section>
                    <section class="tarjeta">
                        <h2>Alertas sonoras</h2>
                        <label class="deslizador deslizador--fila"><span>Volumen</span><input type="range" min="0" max="100" value="40"></label>
                        <label class="casilla"><input type="checkbox" checked> Pico de siniestros</label>
                        <label class="casilla"><input type="checkbox" checked> Fraude organizado</label>
                    </section>
                </div>
            </div>
        </div>
`,
};
