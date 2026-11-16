// Datos de ejemplo compartidos por varias pantallas.
// Más adelante este módulo se reemplazaría por llamadas a una API (por ejemplo, un servicio con PostgreSQL).

export const CASOS = [
  { id: 'RCL-2041', asegurado: 'Asegurado A', reclamante: 'Carla Mendoza', tipo: 'Vehicular', riesgo: 'Alto', urgencia: 'Alta', plazo: 2, estado: 'En revisión', poliza: 'PL-018741', monto: 18500, fecha: '12/09/2026' },
  { id: 'RCL-2038', asegurado: 'Asegurado B', reclamante: 'Jorge Palacios', tipo: 'Salud', riesgo: 'Alto', urgencia: 'Alta', plazo: 3, estado: 'Nuevo', poliza: 'PL-017220', monto: 9400, fecha: '10/09/2026' },
  { id: 'RCL-2052', asegurado: 'Asegurado C', reclamante: 'Lucía Fernández', tipo: 'Hogar', riesgo: 'Medio', urgencia: 'Media', plazo: 6, estado: 'Nuevo', poliza: 'PL-019903', monto: 6200, fecha: '14/09/2026' },
  { id: 'RCL-2047', asegurado: 'Asegurado D', reclamante: 'Pedro Alarcón', tipo: 'Vida', riesgo: 'Medio', urgencia: 'Media', plazo: 7, estado: 'En revisión', poliza: 'PL-016118', monto: 52000, fecha: '08/09/2026' },
  { id: 'RCL-2033', asegurado: 'Asegurado E', reclamante: 'Rosa Chávez', tipo: 'Vehicular', riesgo: 'Bajo', urgencia: 'Baja', plazo: 10, estado: 'Pendiente', poliza: 'PL-015477', monto: 3100, fecha: '02/09/2026' },
  { id: 'RCL-2029', asegurado: 'Asegurado F', reclamante: 'Iván Huamán', tipo: 'Salud', riesgo: 'Bajo', urgencia: 'Baja', plazo: 12, estado: 'Pendiente', poliza: 'PL-014002', monto: 2200, fecha: '30/08/2026' },
  { id: 'RCL-2025', asegurado: 'Asegurado G', reclamante: 'Marta Soto', tipo: 'Hogar', riesgo: 'Bajo', urgencia: 'Baja', plazo: 14, estado: 'Pendiente', poliza: 'PL-013559', monto: 1800, fecha: '27/08/2026' },
];

export const NOTIFICACIONES = [
  { id: 1, texto: 'Nuevo caso asignado: RCL-2052. Inicia la evaluación.', tipo: 'info', leida: false, ruta: '/expediente/RCL-2052/resumen' },
  { id: 2, texto: 'Alerta: posible red de fraude vinculada a RCL-2038.', tipo: 'alerta', leida: false, ruta: '/expediente/RCL-2038/similares' },
  { id: 3, texto: 'Plazo próximo a vencer en 2 casos.', tipo: 'plazo', leida: false, ruta: '/reclamos' },
  { id: 4, texto: 'La decisión del caso RCL-2019 fue registrada en la bitácora.', tipo: 'info', leida: true, ruta: '/historial' },
];

export const ESTADOS = ['Nuevo', 'En revisión', 'Pendiente'];
export const RIESGOS = ['Alto', 'Medio', 'Bajo'];

export function buscarCaso(id) {
  return CASOS.find((c) => c.id === id);
}

export const claseRiesgo = (nivel) => ({ Alto: 'rojo', Alta: 'rojo', Medio: 'ambar', Media: 'ambar', Bajo: 'verde', Baja: 'verde' }[nivel] ?? 'gris');
export const claseEstado = (estado) => (estado === 'Nuevo' ? 'gris' : 'ambar');

export const formatoMoneda = (n) => `S/ ${n.toLocaleString('es-PE')}`;
