// Comportamiento del inicio de sesión: validación, ingreso (base de datos o demostración local) y entrada según el rol (UF-01).
import { validarFormulario } from '../nucleo/formularios.js';
import { buscarUsuario, CLAVE_DEMO, inicioDe } from '../config/roles.js';
import { iniciarSesion } from '../nucleo/almacen.js';
import { toast } from '../nucleo/avisos.js';
import { hayBaseDeDatos } from '../datos/supabase.js';
import { entrar, cargarTodo } from '../datos/repositorio.js';

export default function login(raiz, ctx) {
  const form = raiz.querySelector('#form-login');
  const error = raiz.querySelector('#error-login');
  const clave = raiz.querySelector('#clave');
  const boton = raiz.querySelector('#ver-clave');
  const enviar = form.querySelector('.boton-login');

  form.querySelector('#correo').dataset.mensaje = 'Escribe tu correo de trabajo, por ejemplo nombre@empresa.com.';
  clave.dataset.mensaje = 'La contraseña debe tener al menos 8 caracteres.';

  // Mostrar la contraseña ayuda a quien escribe con dificultad (menos errores, menos frustración).
  boton.addEventListener('click', () => {
    const ver = clave.type === 'password';
    clave.type = ver ? 'text' : 'password';
    boton.setAttribute('aria-pressed', String(ver));
    boton.textContent = ver ? 'Ocultar contraseña' : 'Mostrar contraseña';
  });

  raiz.querySelectorAll('[data-demo]').forEach((b) => b.addEventListener('click', () => {
    form.correo.value = b.dataset.demo;
    clave.value = CLAVE_DEMO;
    error.hidden = true;
    enviar.focus();
  }));

  const fallo = () => {
    // Mensaje que explica qué pasó y cómo recuperarse (heurística 9).
    error.textContent = '⚠ El correo o la contraseña no coinciden. Revisa los datos e inténtalo otra vez, o usa «¿Olvidaste tu contraseña?».';
    error.hidden = false;
    form.clave.select();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    if (!validarFormulario(form)) return;

    let usuario;
    enviar.disabled = true;
    enviar.textContent = 'Ingresando…';
    try {
      if (hayBaseDeDatos) {
        usuario = await entrar(form.correo.value, form.clave.value);
        if (usuario) { iniciarSesion(usuario); await cargarTodo(); }
      } else {
        const demo = buscarUsuario(form.correo.value);
        usuario = demo && form.clave.value === CLAVE_DEMO ? demo : null;
        if (usuario) iniciarSesion(usuario);
      }
    } catch (err) {
      error.textContent = `⚠ No pudimos conectar con la base de datos (${err.message}). Revisa tu conexión e inténtalo de nuevo.`;
      error.hidden = false;
      return;
    } finally {
      enviar.disabled = false;
      enviar.textContent = 'Ingresar';
    }
    if (!usuario) return fallo();
    toast(`Bienvenida/o, ${usuario.nombre}. Ingresaste como ${usuario.rol === 'admin' ? 'administrador' : usuario.rol}.`, 'ok');
    ctx.ir(inicioDe(usuario.rol));
  });
}
