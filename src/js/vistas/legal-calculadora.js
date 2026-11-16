// Vista: Calculadora de riesgo de multas y sanciones (wireframe W-32)
import '../../styles/vistas/legal-calculadora.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-calculadora">
            <p class="migas">Área legal › Riesgo y paquetes › RCL-2041</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Calculadora de multas y sanciones</h1>
                <a class="boton boton--primario" href="#/legal/riesgo/paquete">Guardar en el expediente</a>
            </div>
            <div class="calculadora">
                <section class="tarjeta">
                    <h2>Datos del caso</h2>
                        <label class="deslizador"><span>Monto reclamado<b>S/ 45 000</b></span><input type="range" min="0" max="100" value="45"></label>
                        <label class="deslizador"><span>Días de retraso en la respuesta<b>12 días</b></span><input type="range" min="0" max="100" value="38"></label>
                        <label class="deslizador"><span>Gravedad del incumplimiento<b>Media</b></span><input type="range" min="0" max="100" value="55"></label>
                        <label class="deslizador"><span>Antecedentes de sanciones<b>2 en 12 meses</b></span><input type="range" min="0" max="100" value="40"></label>
                </section>
                <div>
                    <section class="tarjeta">
                        <h2>Riesgo estimado de sanción</h2>
                        <div class="dona"><span>42 %</span></div>
                    </section>
                    <section class="tarjeta factores">
                        <h2>Factores principales</h2>
                        <p>Retraso en la respuesta</p><div class="progreso"><div style="width: 75%"></div></div>
                        <p>Antecedentes de sanciones</p><div class="progreso"><div style="width: 38%"></div></div>
                    </section>
                </div>
            </div>
        </div>
`,
};
