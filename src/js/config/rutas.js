// Mapa del sitio: una sola arquitectura de información para escritorio y móvil.
// Cada ruta apunta a un módulo de src/vistas/<vista>.js

const TODOS = 'todos';

/** Pestañas de cada sección (se muestran bajo la cabecera). `:caso` se rellena con el caso actual. */
export const PESTANAS = {
  panel: [
    { id: 'panel', nombre: 'Panel del analista', ruta: '/panel' },
    { id: 'centro', nombre: 'Centro de comando', ruta: '/centro-comando', roles: ['gerente'] },
    { id: 'notificaciones', nombre: 'Notificaciones', ruta: '/notificaciones' },
  ],
  reclamos: [
    { id: 'bandeja', nombre: 'Bandeja', ruta: '/reclamos' },
    { id: 'expediente', nombre: 'Expediente del caso', ruta: '/expediente/:caso/resumen' },
    { id: 'informe', nombre: 'Decisión e informe', ruta: '/expediente/:caso/informe' },
  ],
  historial: [
    { id: 'registro', nombre: 'Registro de decisiones', ruta: '/historial', roles: ['analista', 'lider', 'auditor', 'gerente', 'legal'] },
    { id: 'consultas', nombre: 'Consultas', ruta: '/historial/consultas', roles: ['tecnico', 'gerente'] },
    { id: 'auditoria', nombre: 'Auditoría', ruta: '/historial/auditoria', roles: ['auditor', 'lider', 'gerente'] },
  ],
  legal: [
    { id: 'evidencia', nombre: 'Evidencia', ruta: '/legal' },
    { id: 'contratos', nombre: 'Contratos', ruta: '/legal/contratos' },
    { id: 'dictamen', nombre: 'Dictamen y plazos', ruta: '/legal/dictamen' },
    { id: 'riesgo', nombre: 'Riesgo y paquetes', ruta: '/legal/riesgo' },
  ],
  gerencia: [
    { id: 'rendimiento', nombre: 'Rendimiento', ruta: '/gerencia', roles: ['gerente'] },
    { id: 'equipo', nombre: 'Equipo y carga', ruta: '/gerencia/equipo', roles: ['gerente', 'lider'] },
    { id: 'reservas', nombre: 'Reservas y reportes', ruta: '/gerencia/reservas', roles: ['gerente'] },
    { id: 'automatizacion', nombre: 'Automatización y cliente', ruta: '/gerencia/automatizacion', roles: ['gerente'] },
  ],
  configuracion: [
    { id: 'usuarios', nombre: 'Usuarios y accesos', ruta: '/configuracion' },
    { id: 'reglas', nombre: 'Reglas del sistema', ruta: '/configuracion/reglas' },
    { id: 'ayuda', nombre: 'Ayuda y preferencias', ruta: '/configuracion/preferencias', roles: TODOS },
  ],
};

// `roles` vacío = lo ven los roles que tienen acceso a la sección. TODOS = cualquier persona con sesión.
export const RUTAS = [
  { ruta: '/login', vista: 'login', titulo: 'Iniciar sesión', publica: true },

  // Panel
  { ruta: '/panel', vista: 'panel', titulo: 'Panel del analista', seccion: 'panel', pestana: 'panel' },
  { ruta: '/centro-comando', vista: 'centro-comando', titulo: 'Centro de comando', seccion: 'panel', pestana: 'centro', roles: ['gerente'] },
  { ruta: '/notificaciones', vista: 'notificaciones', titulo: 'Notificaciones', seccion: 'panel', pestana: 'notificaciones', roles: TODOS },

  // Reclamos
  { ruta: '/reclamos', vista: 'bandeja', titulo: 'Bandeja de reclamos', seccion: 'reclamos', pestana: 'bandeja' },
  { ruta: '/reclamos/nuevo', vista: 'nuevo-reclamo', titulo: 'Registrar reclamo', seccion: 'reclamos', pestana: 'bandeja', roles: ['analista', 'lider'] },
  { ruta: '/expediente/:caso/resumen', vista: 'expediente-resumen', titulo: 'Expediente – Resumen', seccion: 'reclamos', pestana: 'expediente' },
  { ruta: '/expediente/:caso/documentos', vista: 'expediente-documentos', titulo: 'Expediente – Documentos y adjuntos', seccion: 'reclamos', pestana: 'expediente' },
  { ruta: '/expediente/:caso/inconsistencias', vista: 'expediente-inconsistencias', titulo: 'Expediente – Inconsistencias', seccion: 'reclamos', pestana: 'expediente' },
  { ruta: '/expediente/:caso/identidad', vista: 'expediente-identidad', titulo: 'Expediente – Identidad y listas de control', seccion: 'reclamos', pestana: 'expediente' },
  { ruta: '/expediente/:caso/similares', vista: 'expediente-similares', titulo: 'Expediente – Casos similares y redes', seccion: 'reclamos', pestana: 'expediente' },
  { ruta: '/expediente/:caso/bitacora', vista: 'expediente-bitacora', titulo: 'Expediente – Bitácora', seccion: 'reclamos', pestana: 'expediente' },
  { ruta: '/expediente/:caso/informe', vista: 'expediente-informe', titulo: 'Informe del caso', seccion: 'reclamos', pestana: 'informe' },

  // Historial
  { ruta: '/historial', vista: 'historial', titulo: 'Historial de decisiones', seccion: 'historial', pestana: 'registro', roles: ['analista', 'lider', 'auditor', 'gerente', 'legal'] },
  { ruta: '/historial/consultas', vista: 'historial-consultas', titulo: 'Consulta avanzada de datos', seccion: 'historial', pestana: 'consultas', roles: ['tecnico', 'gerente'] },
  { ruta: '/historial/auditoria', vista: 'historial-auditoria', titulo: 'Detalle de la decisión y bitácora', seccion: 'historial', pestana: 'auditoria', roles: ['auditor', 'lider', 'gerente'] },

  // Área legal
  { ruta: '/legal', vista: 'legal-bandeja', titulo: 'Bandeja legal con plazos', seccion: 'legal', pestana: 'evidencia' },
  { ruta: '/legal/expediente', vista: 'legal-expediente', titulo: 'Expediente legal', seccion: 'legal', pestana: 'evidencia' },
  { ruta: '/legal/visor', vista: 'legal-visor', titulo: 'Visor comparativo', seccion: 'legal', pestana: 'evidencia' },
  { ruta: '/legal/audio', vista: 'legal-audio', titulo: 'Audio y transcripción', seccion: 'legal', pestana: 'evidencia' },
  { ruta: '/legal/contratos', vista: 'legal-contratos', titulo: 'Contrato traducido', seccion: 'legal', pestana: 'contratos' },
  { ruta: '/legal/contratos/mapa', vista: 'legal-mapa-calor', titulo: 'Mapa de calor de cláusulas', seccion: 'legal', pestana: 'contratos' },
  { ruta: '/legal/dictamen', vista: 'legal-dictamen', titulo: 'Causal de exclusión', seccion: 'legal', pestana: 'dictamen' },
  { ruta: '/legal/notificaciones', vista: 'legal-notificaciones', titulo: 'Notificaciones y acuses', seccion: 'legal', pestana: 'dictamen' },
  { ruta: '/legal/riesgo', vista: 'legal-riesgo', titulo: 'Antecedentes de arbitrajes y procesos', seccion: 'legal', pestana: 'riesgo' },
  { ruta: '/legal/riesgo/calculadora', vista: 'legal-calculadora', titulo: 'Calculadora de multas y sanciones', seccion: 'legal', pestana: 'riesgo' },
  { ruta: '/legal/riesgo/paquete', vista: 'legal-paquete', titulo: 'Paquete para SBS e Indecopi', seccion: 'legal', pestana: 'riesgo' },

  // Gerencia
  { ruta: '/gerencia', vista: 'gerencia-roi', titulo: 'ROI y reservas', seccion: 'gerencia', pestana: 'rendimiento', roles: ['gerente'] },
  { ruta: '/gerencia/benchmarking', vista: 'gerencia-benchmarking', titulo: 'Benchmarking competitivo', seccion: 'gerencia', pestana: 'rendimiento', roles: ['gerente'] },
  { ruta: '/gerencia/terceros', vista: 'gerencia-terceros', titulo: 'Desempeño de terceros', seccion: 'gerencia', pestana: 'rendimiento', roles: ['gerente'] },
  { ruta: '/gerencia/equipo', vista: 'gerencia-equipo', titulo: 'Carga del equipo', seccion: 'gerencia', pestana: 'equipo', roles: ['gerente', 'lider'] },
  { ruta: '/gerencia/reservas', vista: 'gerencia-reservas', titulo: 'SCTR y Vida en tiempo real', seccion: 'gerencia', pestana: 'reservas', roles: ['gerente'] },
  { ruta: '/gerencia/reportes', vista: 'gerencia-reportes', titulo: 'Reportes regulatorios', seccion: 'gerencia', pestana: 'reservas', roles: ['gerente'] },
  { ruta: '/gerencia/automatizacion', vista: 'gerencia-automatizacion', titulo: 'Aprobación automática', seccion: 'gerencia', pestana: 'automatizacion', roles: ['gerente'] },
  { ruta: '/gerencia/via-rapida', vista: 'gerencia-via-rapida', titulo: 'Vía rápida para el cliente honesto', seccion: 'gerencia', pestana: 'automatizacion', roles: ['gerente'] },
  { ruta: '/gerencia/encuesta', vista: 'gerencia-encuesta', titulo: 'Encuesta de satisfacción', seccion: 'gerencia', pestana: 'automatizacion', roles: ['gerente'] },

  // Configuración
  { ruta: '/configuracion', vista: 'config-usuarios', titulo: 'Usuarios y accesos', seccion: 'configuracion', pestana: 'usuarios' },
  { ruta: '/configuracion/reglas', vista: 'config-reglas', titulo: 'Reglas del sistema', seccion: 'configuracion', pestana: 'reglas', roles: ['admin'] },
  { ruta: '/configuracion/preferencias', vista: 'config-preferencias', titulo: 'Preferencias de lectura', seccion: 'configuracion', pestana: 'ayuda', roles: TODOS },
];

/** ¿Puede este rol abrir la ruta? */
export function puedeVer(ruta, rol, secciones) {
  if (ruta.publica) return true;
  if (ruta.roles === TODOS) return true;
  if (ruta.roles) return ruta.roles.includes(rol);
  return secciones.includes(ruta.seccion);
}

export function pestanasVisibles(seccion, rol, caso) {
  return (PESTANAS[seccion] ?? [])
    .filter((p) => p.roles === TODOS || !p.roles || p.roles.includes(rol))
    .map((p) => ({ ...p, ruta: p.ruta.replace(':caso', caso) }));
}

/** Convierte '/expediente/:caso/resumen' en una expresión regular con nombres de parámetros. */
export function compilar(patron) {
  const nombres = [];
  const fuente = patron.replace(/:([a-z]+)/gi, (_, n) => (nombres.push(n), '([^/]+)'));
  return { regex: new RegExp(`^${fuente}$`), nombres };
}
