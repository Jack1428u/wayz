// Vista: Historial de decisiones (wireframe W-18)
import '../../styles/vistas/historial.css';

export default {
  render: (ctx) => `
        <div class="pagina v-historial pagina--relativa">
            <div class="encabezado">
                <h1 class="pagina__titulo">Historial de decisiones</h1>
                <button type="button" class="boton boton--primario" data-alternar="exportar" aria-expanded="false" aria-controls="exportar">Exportar para auditoría</button>
            </div>
            <form class="filtros" novalidate>
                <select><option>Periodo</option></select><select><option>Decisión</option></select><select><option>Analista</option></select>
                <input type="search" placeholder="Buscar por asegurado o empresa">
            </form>
            <div class="historial">
                <section class="tarjeta">
                    <table class="tabla">
                        <thead><tr><th>Caso</th><th>Fecha</th><th>Analista</th><th>Decisión</th><th>Justificación</th></tr></thead>
                        <tbody>
                            <tr class="seleccionada"><td><a href="#/historial/auditoria">RCL-2041</a></td><td>dd/mm</td><td>Analista 1</td><td><span class="etiqueta etiqueta--rojo">Rechazado</span></td><td>Exclusión expresa</td></tr>
                            <tr><td><a href="#/historial/auditoria">RCL-2038</a></td><td>dd/mm</td><td>Analista 2</td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>Cobertura vigente</td></tr>
                            <tr><td><a href="#/historial/auditoria">RCL-2033</a></td><td>dd/mm</td><td>Analista 1</td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>Sin alertas</td></tr>
                            <tr><td><a href="#/historial/auditoria">RCL-2029</a></td><td>dd/mm</td><td>Analista 3</td><td><span class="etiqueta etiqueta--rojo">Rechazado</span></td><td>Documentos falsos</td></tr>
                            <tr><td><a href="#/historial/auditoria">RCL-2025</a></td><td>dd/mm</td><td>Analista 2</td><td><span class="etiqueta etiqueta--verde">Aprobado</span></td><td>Sin alertas</td></tr>
                            <tr><td><a href="#/historial/auditoria">RCL-2019</a></td><td>dd/mm</td><td>Analista 1</td><td>Derivado</td><td>Caso complejo</td></tr>
                        </tbody>
                    </table>
                </section>
                <aside class="tarjeta">
                    <h2>Casos similares del mismo asegurado</h2>
                    <p class="caso-similar"><b>RCL-1904</b><small>Aprobado</small></p>
                    <p class="caso-similar"><b>RCL-1855</b><small>Rechazado</small></p>
                </aside>
            </div>
            <section class="tarjeta exportar" id="exportar" hidden>
                <h2>Exportar para auditoría</h2>
                <div class="radios"><label><input type="radio" name="fmt" checked> PDF</label><label><input type="radio" name="fmt"> Excel</label></div>
                <label class="casilla"><input type="checkbox" checked> Incluir bitácora</label>
                <div class="exportar__fila">
                    <select><option>Rango: último mes</option><option>Última semana</option><option>Último año</option></select>
                    <button type="button" class="boton boton--primario" data-accion>Generar</button>
                </div>
            </section>
        </div>
`,
};
