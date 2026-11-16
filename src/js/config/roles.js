// Roles, permisos y cuentas de demostración.
// HU-027: cada rol ve solo las secciones que le corresponden.

export const SECCIONES = {
  panel: { nombre: 'Panel', icono: '▦' },
  reclamos: { nombre: 'Reclamos', icono: '▤' },
  historial: { nombre: 'Historial', icono: '◷' },
  legal: { nombre: 'Área legal', icono: '⚖' },
  gerencia: { nombre: 'Gerencia', icono: '▥' },
  configuracion: { nombre: 'Configuración', icono: '⚙' },
};

export const ROLES = {
  analista: { nombre: 'Analista', secciones: ['panel', 'reclamos', 'historial'] },
  lider: { nombre: 'Líder de analistas', secciones: ['panel', 'reclamos', 'historial', 'gerencia'] },
  gerente: { nombre: 'Gerente', secciones: ['panel', 'reclamos', 'historial', 'gerencia'] },
  legal: { nombre: 'Asesor legal', secciones: ['legal', 'historial'] },
  auditor: { nombre: 'Auditor', secciones: ['historial'] },
  tecnico: { nombre: 'Analista técnico', secciones: ['historial'] },
  admin: { nombre: 'Administrador', secciones: ['configuracion'] },
};

// Todas las cuentas de demostración comparten esta contraseña (no es un sistema real).
export const CLAVE_DEMO = 'Wayz2026';

export const USUARIOS_DEMO = [
  { correo: 'analista@wayz.demo', rol: 'analista', nombre: 'Ana Torres' },
  { correo: 'lider@wayz.demo', rol: 'lider', nombre: 'Luis Quispe' },
  { correo: 'gerente@wayz.demo', rol: 'gerente', nombre: 'Gabriela Ríos' },
  { correo: 'legal@wayz.demo', rol: 'legal', nombre: 'Mateo Salas' },
  { correo: 'auditor@wayz.demo', rol: 'auditor', nombre: 'Aurora Vega' },
  { correo: 'tecnico@wayz.demo', rol: 'tecnico', nombre: 'Tomás Rivera' },
  { correo: 'admin@wayz.demo', rol: 'admin', nombre: 'Adriana Cruz' },
];

/** Pantalla a la que lleva el botón «Ingresar» según el rol (W-01 → W-03, W-04, W-21, W-43). */
export function inicioDe(rol) {
  return {
    analista: '/panel',
    lider: '/panel',
    gerente: '/centro-comando',
    legal: '/legal',
    auditor: '/historial',
    tecnico: '/historial/consultas',
    admin: '/configuracion',
  }[rol] ?? '/panel';
}

/** Ruta a la que lleva cada sección del menú lateral para un rol. */
export function rutaDeSeccion(seccion, rol) {
  if (seccion === 'panel') return rol === 'gerente' ? '/centro-comando' : '/panel';
  if (seccion === 'historial') return rol === 'tecnico' ? '/historial/consultas' : '/historial';
  if (seccion === 'gerencia') return rol === 'lider' ? '/gerencia/equipo' : '/gerencia';
  return { reclamos: '/reclamos', legal: '/legal', configuracion: '/configuracion' }[seccion];
}

export function buscarUsuario(correo) {
  return USUARIOS_DEMO.find((u) => u.correo === correo.trim().toLowerCase());
}
