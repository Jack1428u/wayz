// Vista: Iniciar sesión (wireframe W-01)
// Izquierda: tarjeta con el logo (la «imagen o mensaje de bienvenida» del wireframe). Derecha: formulario.
import '../../styles/vistas/login.css';
import logo from '../../assets/logo_con_letras.png';
import { USUARIOS_DEMO, ROLES, CLAVE_DEMO } from '../config/roles.js';
import { hayBaseDeDatos } from '../datos/supabase.js';

export default {
  render: () => `
    <div class="v-login">
    <main class="login" id="contenido-principal" tabindex="-1">

      <aside class="login__bienvenida">
        <img src="${logo}" alt="Wayz: detección de fraude en seguros" width="707" height="353">
      </aside>

      <section class="login__formulario">
        <p class="marca">Wayz</p>
        <h1>Iniciar sesión</h1>
        <p class="subtitulo">Ingresa con tu cuenta de la aseguradora</p>

        <form id="form-login" data-propio novalidate>
          <label for="correo">Correo electrónico</label>
          <input type="email" id="correo" name="correo" placeholder="nombre@empresa.com" autocomplete="username" required>

          <label for="clave">Contraseña</label>
          <input type="password" id="clave" name="clave" placeholder="••••••••" autocomplete="current-password" required minlength="8">
          <button type="button" class="enlace-boton" id="ver-clave" aria-pressed="false">Mostrar contraseña</button>

          <div class="opciones">
            <label class="recordar"><input type="checkbox" name="recordar"> Recordar este equipo</label>
            <button type="button" class="enlace-boton" data-dialog="recuperar">¿Olvidaste tu contraseña?</button>
          </div>

          <button type="submit" class="boton-login">Ingresar</button>
          <p class="error-login" id="error-login" role="alert" hidden></p>
        </form>

        ${hayBaseDeDatos ? '' : `<details class="demo">
          <summary>Cuentas de demostración</summary>
          <p class="demo__ayuda">Modo sin conexión: elige un rol para rellenar los datos. Contraseña: <strong>${CLAVE_DEMO}</strong></p>
          <div class="demo__botones">
            ${USUARIOS_DEMO.map((u) => `<button type="button" class="demo__boton" data-demo="${u.correo}" title="${u.correo}">${ROLES[u.rol].nombre}</button>`).join('')}
          </div>
        </details>`}

        <footer>
          <button type="button" class="enlace-boton" data-dialog="soporte">Soporte local</button> ·
          <button type="button" class="enlace-boton" data-accion="Términos y condiciones">Términos y condiciones</button> ·
          <button type="button" class="enlace-boton" data-accion="Protección de datos">Protección de datos</button>
        </footer>
      </section>
    </main>
    </div>`,
};
