// Vista: Preferencias de lectura (paleta y contraste) (wireframe W-46)
import '../../styles/vistas/config-preferencias.css';

export default {
  render: (ctx) => `
        <div class="pagina v-config-preferencias">
            <p class="migas">Configuración › Ayuda y preferencias</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Preferencias de lectura</h1>
                <div class="encabezado__botones">
                    <button type="button" class="boton" data-restablecer>Restablecer</button>
                    <button type="button" class="boton boton--primario" data-guardar>Guardar</button>
                </div>
            </div>
            <div class="lectura">
                <section class="tarjeta">
                    <h2>Apariencia</h2>
                    <p class="rotulo">Paleta</p>
                    <div class="paleta">
                        <button type="button" class="muestra"><i style="background: #ffffff"></i><small>Clara</small></button>
                        <button type="button" class="muestra"><i style="background: #efefef"></i><small>Cálida</small></button>
                        <button type="button" class="muestra"><i style="background: #555555"></i><small>Oscura</small></button>
                        <button type="button" class="muestra"><i style="background: #000000"></i><small>Alto contraste</small></button>
                    </div>
                    <label class="deslizador"><span>Contraste</span><input type="range" min="0" max="100" value="62"></label>
                    <label class="deslizador"><span>Tamaño del texto</span><input type="range" min="0" max="100" value="35"></label>
                    <label class="interruptor interruptor--fila">Resaltar evidencia crítica <input type="checkbox" checked></label>
                </section>
                <section class="tarjeta">
                    <h2>Vista previa del expediente</h2>
                    <div class="hoja">
                        <i></i><i></i><i class="corta"></i>
                        <p class="resaltado">Evidencia crítica resaltada</p>
                        <i></i><i class="media"></i><i class="corta"></i><i></i>
                    </div>
                </section>
            </div>
            <p class="nota-pie"><button type="button" data-dialog="soporte">¿Necesitas ayuda? Soporte técnico local →</button></p>
        </div>
`,
};
