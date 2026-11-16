// Vista: Usuarios y matriz de accesos (wireframe W-43)
import '../../styles/vistas/config-usuarios.css';

export default {
  render: (ctx) => `
        <div class="pagina v-config-usuarios">
            <div class="encabezado">
                <h1 class="pagina__titulo">Usuarios y accesos</h1>
                <button type="button" class="boton boton--primario" data-accion>Nuevo usuario</button>
            </div>
            <div class="accesos">
                <div>
                    <section class="tarjeta">
                        <table class="tabla">
                            <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th></tr></thead>
                            <tbody>
                        <tr class="seleccionada"><td>Usuario 1</td><td>Analista</td><td>Activo</td></tr>
                        <tr><td>Usuario 2</td><td>Asesor legal</td><td>Activo</td></tr>
                        <tr><td>Usuario 3</td><td>Gerente</td><td>Activo</td></tr>
                        <tr><td>Usuario 4</td><td>Analista</td><td>Inactivo</td></tr>
                            </tbody>
                        </table>
                    </section>
                    <h2 class="subtitulo-seccion">Matriz de accesos por rol</h2>
                    <section class="tarjeta">
                        <table class="tabla matriz">
                            <thead><tr><th>Sección</th><th>Analista</th><th>Legal</th><th>Gerencia</th><th>Admin.</th></tr></thead>
                            <tbody>
                        <tr><td>Reclamos</td><td>✓</td><td>✓</td><td>–</td><td>–</td></tr>
                        <tr><td>Área legal</td><td>–</td><td>✓</td><td>–</td><td>–</td></tr>
                        <tr><td>Gerencia</td><td>–</td><td>–</td><td>✓</td><td>✓</td></tr>
                        <tr><td>Configuración</td><td>–</td><td>–</td><td>–</td><td>✓</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>
                <form class="tarjeta" novalidate>
                    <h2>Asignar rol y permisos</h2>
                    <p class="usuario-sel">Usuario 1</p>
                    <label class="campo"><span>Rol</span><select><option>Analista</option><option>Asesor legal</option><option>Gerente</option></select></label>
                    <label class="casilla"><input type="checkbox" checked> Reclamos</label>
                    <label class="casilla"><input type="checkbox" checked> Historial</label>
                    <label class="casilla"><input type="checkbox"> Área legal</label>
                    <label class="casilla"><input type="checkbox"> Gerencia</label>
                    <button type="submit" class="boton boton--primario boton--ancho">Guardar permisos</button>
                </form>
            </div>
        </div>
`,
};
