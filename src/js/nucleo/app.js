// Enrutador: lee la dirección (#/ruta), comprueba permisos y dibuja la vista correspondiente.
// Se usa «#» (hash) porque GitHub Pages no puede redirigir rutas internas: así funciona publicado y en local.

import { RUTAS, compilar, puedeVer } from '../config/rutas.js';
import { inicioDe } from '../config/roles.js';
import { obtenerSesion, trabajo } from './almacen.js';
import { montarEstructura, desmontarEstructura, hayEstructura, actualizarNavegacion } from '../componentes/estructura.js';
import { mejorarContenido } from './accesibilidad.js';
import { cerrarDialogos } from './dialogo.js';
import { anunciar, toast } from './avisos.js';

const vistas = import.meta.glob('../vistas/*.js');
const comportamientos = import.meta.glob('../comportamientos/*.js');
const compiladas = RUTAS.map((r) => ({ ...r, ...compilar(r.ruta) }));

let limpiar = null;
let turno = 0;

/** Los parámetros de la URL (p. ej. el código del caso) solo pueden tener letras, números, guion, punto y guion bajo. Evita inyectar HTML por enlace. */
function parametroSeguro(texto) {
  let t = texto;
  try { t = decodeURIComponent(texto); } catch { /* texto mal codificado: se usa tal cual y se limpia */ }
  return t.replace(/[^\w.-]/g, '').slice(0, 40);
}

function resolver(hash) {
  const [camino, consulta = ''] = hash.replace(/^#/, '').split('?');
  const path = camino || '/';
  for (const r of compiladas) {
    const m = r.regex.exec(path);
    if (m) {
      const params = Object.fromEntries(r.nombres.map((n, i) => [n, parametroSeguro(m[i + 1])]));
      return { ruta: r, params, query: Object.fromEntries(new URLSearchParams(consulta)) };
    }
  }
  return { ruta: null, params: {}, query: {}, path };
}

const ir = (path) => { location.hash = `#${path}`; };

export async function navegar() {
  const mio = ++turno;
  if (!location.hash.startsWith('#/')) return ir('/');
  const { ruta, params, query, path } = resolver(location.hash);
  const sesion = obtenerSesion();

  // 1) Sin sesión solo se puede ver el inicio de sesión.
  if (!sesion && !(ruta?.publica)) return ir('/login');
  if (sesion && (path === '/' || ruta?.publica)) return ir(inicioDe(sesion.rol));

  // 2) Con sesión: la ruta debe existir y estar permitida para el rol (mensaje claro en vez de pantalla en blanco).
  if (sesion && !ruta) {
    toast('Esa página no existe. Te llevamos al inicio.', 'alerta');
    return ir(inicioDe(sesion.rol));
  }
  if (sesion && !puedeVer(ruta, sesion.rol, sesion.secciones)) {
    toast(`Tu rol (${sesion.rolNombre}) no tiene acceso a «${ruta.titulo}».`, 'alerta');
    return ir(inicioDe(sesion.rol));
  }

  if (params.caso) trabajo.casoActual = params.caso;
  cerrarDialogos();
  limpiar?.();
  limpiar = null;

  let contenedor;
  if (ruta.publica) {
    desmontarEstructura();
    contenedor = document.getElementById('app');
  } else {
    contenedor = hayEstructura() ? document.getElementById('vista') : montarEstructura(sesion);
    actualizarNavegacion(ruta, sesion);
  }

  const ctx = { ruta, params, query, sesion, rol: sesion?.rol, ir };
  const modulo = await vistas[`../vistas/${ruta.vista}.js`]();
  if (mio !== turno) return; // el usuario ya navegó a otra parte
  contenedor.innerHTML = modulo.default.render(ctx);
  mejorarContenido(contenedor);

  const extra = comportamientos[`../comportamientos/${ruta.vista}.js`];
  if (extra) limpiar = (await extra()).default(contenedor, ctx);
  if (mio !== turno) return;

  document.title = `${ruta.titulo} · Wayz`;
  anunciar(`Pantalla: ${ruta.titulo}`);
  // Al cambiar de pantalla el foco pasa al título, para que teclado y lectores de pantalla empiecen desde ahí.
  const titulo = contenedor.querySelector('h1');
  if (titulo) { titulo.tabIndex = -1; titulo.focus({ preventScroll: true }); }
  window.scrollTo(0, 0);
}

export function iniciarEnrutador() {
  window.addEventListener('hashchange', navegar);
  return navegar();
}
