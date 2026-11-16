// Vista: Encuesta de satisfacción (wireframe W-42)
import '../../styles/vistas/gerencia-encuesta.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-encuesta">
            <p class="migas">Gerencia › Automatización y cliente</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Encuesta de satisfacción</h1>
                <button type="button" class="boton boton--primario" data-accion>Guardar</button>
            </div>
            <div class="encuesta">
                <div>
                    <section class="tarjeta">
                        <h2>Envío</h2>
                        <div class="fila fila--envio">
                            <label class="campo"><span>Cuándo enviar</span><select><option>Al resolver el reclamo</option></select></label>
                            <label class="casilla"><input type="checkbox" checked> Correo</label>
                            <label class="casilla"><input type="checkbox"> SMS</label>
                        </div>
                    </section>
                    <section class="tarjeta">
                        <h2>Preguntas</h2>
                        <label class="campo"><input type="text" value="¿Qué tan rápido resolvimos tu reclamo?"></label>
                        <label class="campo"><input type="text" value="¿Recomendarías a la aseguradora?"></label>
                        <label class="campo"><input type="text" value="Comentarios (opcional)"></label>
                    </section>
                    <section class="tarjeta">
                        <h2>Vista previa</h2>
                        <p class="estrellas">★★★★★ <small>Califica la rapidez de tu atención</small></p>
                    </section>
                </div>
                <div>
                    <section class="tarjeta">
                        <h2>Satisfacción general</h2>
                        <div class="dona"><span>4,5</span></div>
                    </section>
                    <section class="tarjeta">
                        <h2>Evolución mensual</h2>
                        <svg class="grafico" viewBox="0 0 280 90" role="img" aria-label="Evolución mensual de la satisfacción">
                            <defs><linearGradient id="relS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563eb" stop-opacity="0.25"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs>
                            <line class="eje" x1="4" x2="280" y1="86" y2="86"/><line class="eje" x1="4" x2="4" y1="2" y2="86"/>
                            <path d="M8,62 C17,61 43,58 60,56 C77,54 95,52 112,52 C129,52 147,57 164,55 C181,53 199,44 216,40 C233,36 259,35 268,34 L268,86 L8,86 Z" fill="url(#relS)"/><path class="linea" d="M8,62 C17,61 43,58 60,56 C77,54 95,52 112,52 C129,52 147,57 164,55 C181,53 199,44 216,40 C233,36 259,35 268,34"/><g class="puntos"><circle cx="8" cy="62" r="2.5"/><circle cx="60" cy="56" r="2.5"/><circle cx="112" cy="52" r="2.5"/><circle cx="164" cy="55" r="2.5"/><circle cx="216" cy="40" r="2.5"/><circle cx="268" cy="34" r="2.5"/></g>
                        </svg>
                    </section>
                </div>
            </div>
        </div>
`,
};
