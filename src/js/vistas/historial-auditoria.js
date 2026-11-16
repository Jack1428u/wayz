// Vista: Detalle de la decisión y bitácora (wireframe W-19)
import '../../styles/vistas/historial-auditoria.css';

export default {
  render: (ctx) => `
        <div class="pagina v-historial-auditoria">
            <p class="migas">Historial › Auditoría › RCL-2041</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Decisión del caso RCL-2041</h1>
                <div class="encabezado__botones">
                    <a class="boton" href="#/historial">Volver al historial</a>
                    <a class="boton boton--primario" href="#/expediente/RCL-2041/resumen">Abrir expediente</a>
                </div>
            </div>
            <div class="detalle">
                <section class="tarjeta">
                    <h2>Decisión</h2>
                    <dl class="datos-v">
                        <dt>Caso</dt><dd>RCL-2041</dd><dt>Analista</dt><dd>Analista 1</dd><dt>Fecha</dt><dd>dd/mm/aaaa</dd>
                        <dt>Resultado</dt><dd>Rechazado</dd><dt>Justificación</dt><dd>Exclusión expresa, cláusula 4.2</dd>
                    </dl>
                </section>
                <div>
                    <h2 class="subtitulo-seccion">Bitácora de acciones</h2>
                    <section class="tarjeta">
                        <table class="tabla">
                            <thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Acción</th></tr></thead>
                            <tbody>
                        <tr><td>dd/mm hh:mm</td><td>Analista 1</td><td>Abrió el expediente</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Analista 1</td><td>Consultó listas</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Analista 1</td><td>Registró decisión</td></tr>
                        <tr><td>dd/mm hh:mm</td><td>Sistema</td><td>Notificó a Legal</td></tr>
                            </tbody>
                        </table>
                    </section>
                    <p class="aviso-punteado">Registro protegido: no puede modificarse</p>
                </div>
            </div>
        </div>
`,
};
