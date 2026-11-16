// Vista: Consulta avanzada de datos (SQL) (wireframe W-20)
import '../../styles/vistas/historial-consultas.css';

export default {
  render: (ctx) => `
        <div class="pagina v-historial-consultas">
            <div class="encabezado">
                <h1 class="pagina__titulo">Consulta avanzada</h1>
                <div class="encabezado__botones">
                    <button type="button" class="boton" data-accion>Guardar consulta</button>
                    <button type="button" class="boton boton--primario" data-ejecutar>Ejecutar</button>
                </div>
            </div>
            <div class="sql">
                <aside class="tarjeta">
                    <h2>Tablas disponibles</h2>
                    <ul class="lista-tablas">
                        <li>reclamos</li>
                        <li>asegurados</li>
                        <li>decisiones</li>
                        <li>bitacora</li>
                        <li>documentos</li>
                    </ul>
                </aside>
                <div>
                    <textarea class="editor-sql" aria-label="Consulta SQL (solo lectura de datos)" spellcheck="false">SELECT caso, riesgo, decision
FROM reclamos
WHERE riesgo = 'Alto'
ORDER BY fecha DESC;</textarea>
                    <div class="encabezado encabezado--resultados">
                        <h2 class="subtitulo-seccion">Resultados (24 filas)</h2>
                        <button type="button" class="boton" data-exportar>Exportar CSV</button>
                    </div>
                    <section class="tarjeta">
                        <table class="tabla">
                            <thead><tr><th>caso</th><th>riesgo</th><th>decision</th><th>fecha</th></tr></thead>
                            <tbody>
                            <tr><td>RCL-2041</td><td><span class="etiqueta etiqueta--rojo">Alto</span></td><td><span class="etiqueta etiqueta--rojo">Rechazado</span></td><td>dd/mm</td></tr>
                            <tr><td>RCL-2038</td><td><span class="etiqueta etiqueta--rojo">Alto</span></td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>dd/mm</td></tr>
                            <tr><td>RCL-2029</td><td><span class="etiqueta etiqueta--rojo">Alto</span></td><td><span class="etiqueta etiqueta--rojo">Rechazado</span></td><td>dd/mm</td></tr>
                            <tr><td>RCL-2012</td><td><span class="etiqueta etiqueta--rojo">Alto</span></td><td>Derivado</td><td>dd/mm</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
`,
};
