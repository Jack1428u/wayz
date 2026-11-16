// Estado de la aplicación: sesión, preferencias y datos que cambian mientras se usa.
// La sesión vive en sessionStorage (se cierra con la pestaña); las preferencias en localStorage.

import { ROLES } from '../config/roles.js';

const CLAVE_SESION = 'wayz.sesion';
const CLAVE_PREFS = 'wayz.prefs';

function leer(almacen, clave) {
  try { return JSON.parse(almacen.getItem(clave)); } catch { return null; }
}
function guardar(almacen, clave, valor) {
  try { almacen.setItem(clave, JSON.stringify(valor)); } catch { /* modo privado: se usa solo en memoria */ }
}

// --- Preferencias de lectura (W-46) -----------------------------------------
function prefsIniciales() {
  const guardadas = leer(localStorage, CLAVE_PREFS);
  if (guardadas) return { ...PREFS_POR_DEFECTO, ...guardadas };
  // Primera visita: respetamos lo que el sistema operativo ya le pidió al navegador.
  const q = (m) => window.matchMedia?.(m).matches;
  return {
    ...PREFS_POR_DEFECTO,
    tema: q('(prefers-contrast: more)') ? 'contraste' : q('(prefers-color-scheme: dark)') ? 'oscura' : 'clara',
  };
}

export const PREFS_POR_DEFECTO = { tema: 'clara', texto: 100, contraste: 60, resaltar: true, sonido: true, sol: false };

let prefs = prefsIniciales();
let sesion = leer(sessionStorage, CLAVE_SESION);
const oyentes = new Set();

export const suscribir = (fn) => (oyentes.add(fn), () => oyentes.delete(fn));
const avisar = (que, extra) => oyentes.forEach((fn) => fn(que, extra));

export const obtenerPrefs = () => ({ ...prefs });
/** `sinNube: true` = el cambio viene de la base de datos, no hace falta volver a guardarlo allí. */
export function cambiarPrefs(parcial, { sinNube = false } = {}) {
  prefs = { ...prefs, ...parcial };
  guardar(localStorage, CLAVE_PREFS, prefs);
  avisar('prefs', { sinNube });
}
export function restablecerPrefs() {
  prefs = { ...PREFS_POR_DEFECTO };
  guardar(localStorage, CLAVE_PREFS, prefs);
  avisar('prefs');
}

// --- Sesión ------------------------------------------------------------------
export const obtenerSesion = () => sesion;
export function iniciarSesion(usuario) {
  sesion = { ...usuario, secciones: ROLES[usuario.rol].secciones, rolNombre: ROLES[usuario.rol].nombre };
  guardar(sessionStorage, CLAVE_SESION, sesion);
  avisar('sesion');
}
export function cerrarSesion() {
  sesion = null;
  try { sessionStorage.removeItem(CLAVE_SESION); } catch { /* nada */ }
  avisar('sesion');
}

// --- Datos de trabajo (se pierden al recargar, como en un prototipo) ---------
export const trabajo = {
  casoActual: 'RCL-2041',
  decision: null, // { tipo, motivo, fecha } tras confirmar una decisión
  plazoLegalDias: 18,
  alertaMostrada: false,
  casosNuevos: [],
};
