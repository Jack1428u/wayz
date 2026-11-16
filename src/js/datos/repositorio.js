// Repositorio: único lugar que habla con la base de datos.
// Lee las tablas y deja los datos con la misma forma que usan las pantallas (CASOS, NOTIFICACIONES…),
// así las vistas no cambian. Las escrituras guardan en la base y luego recargan.
import { supabase, hayBaseDeDatos } from './supabase.js';
import { CASOS, NOTIFICACIONES } from './datos.js';
import { fusionarEvaluaciones } from './agente.js';
import { obtenerSesion, trabajo, cambiarPrefs } from '../nucleo/almacen.js';

export const HISTORIAL = []; // decisiones ya registradas (más recientes primero)
export const ESCALAMIENTOS = [];

const fecha = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
const diasHasta = (iso) => (iso ? Math.round((new Date(`${iso}T00:00:00`) - new Date().setHours(0, 0, 0, 0)) / 86400000) : 99);
const AJUSTE_TIPO = { Aprobar: 'Aprobado', Rechazar: 'Rechazado', 'Derivar a Legal': 'Derivado a Legal' };

function lanzar({ error }) { if (error) throw new Error(error.message); }

// --------------------------------------------------------------------------- lectura
async function cargarReclamos() {
  const { data, error } = await supabase
    .from('reclamos')
    .select('id,codigo,reclamante_nombre,tipo,riesgo,urgencia,estado,monto_estimado,fecha_hecho,fecha_denuncia,plazo_vence,creado_en,polizas(numero,valor_asegurado,asegurados(nombre_completo))')
    .order('creado_en', { ascending: false });
  lanzar({ error });
  const filas = data.map((r) => ({
    uuid: r.id, id: r.codigo, asegurado: r.polizas?.asegurados?.nombre_completo ?? '—', reclamante: r.reclamante_nombre,
    tipo: r.tipo, riesgo: r.riesgo, urgencia: r.urgencia, plazo: diasHasta(r.plazo_vence), estado: r.estado,
    poliza: r.polizas?.numero ?? '', valorAsegurado: Number(r.polizas?.valor_asegurado ?? 0),
    monto: Number(r.monto_estimado), fecha: fecha(r.fecha_denuncia ?? r.fecha_hecho),
  }));
  const orden = { Alto: 0, Medio: 1, Bajo: 2 };
  const activos = filas.filter((c) => c.estado !== 'Decidido').sort((a, b) => orden[a.riesgo] - orden[b.riesgo] || a.plazo - b.plazo);
  CASOS.splice(0, CASOS.length, ...activos);
  trabajo.casosNuevos.length = 0; // ya vienen incluidos en CASOS
  return filas;
}

async function cargarEvaluaciones() {
  const { data, error } = await supabase
    .from('evaluaciones_agente')
    .select('puntaje,prioridad,resumen,motivos,accion_sugerida,herramientas,modo,creado_en,reclamos(codigo)')
    .order('creado_en', { ascending: false });
  lanzar({ error });
  const mapa = {};
  data.forEach((e) => {
    const id = e.reclamos?.codigo;
    if (!id || mapa[id]) return; // la primera es la más reciente
    mapa[id] = { id, puntaje: e.puntaje, prioridad: e.prioridad, resumen: e.resumen, motivos: e.motivos ?? [], accion: e.accion_sugerida, herramientas: e.herramientas ?? [], modo: e.modo, fecha: e.creado_en };
  });
  fusionarEvaluaciones(mapa);
}

async function cargarNotificaciones() {
  const { data, error } = await supabase.from('notificaciones').select('id,tipo,texto,ruta,leida,creado_en').order('creado_en', { ascending: false });
  lanzar({ error });
  NOTIFICACIONES.splice(0, NOTIFICACIONES.length, ...data.map((n) => ({ id: n.id, tipo: n.tipo, texto: n.texto, ruta: n.ruta, leida: n.leida })));
}

async function cargarDecisiones() {
  const { data, error } = await supabase
    .from('decisiones')
    .select('tipo,justificacion,falsa_alarma,creado_en,reclamos(codigo,tipo),usuarios(nombre)')
    .order('creado_en', { ascending: false });
  lanzar({ error });
  HISTORIAL.splice(0, HISTORIAL.length, ...data.map((d) => ({
    caso: d.reclamos?.codigo, tipoReclamo: d.reclamos?.tipo, decision: AJUSTE_TIPO[d.tipo] ?? d.tipo, motivo: d.justificacion,
    falsaAlarma: d.falsa_alarma, por: d.usuarios?.nombre ?? '—', fecha: d.creado_en,
  })));
}

async function cargarPlazo() {
  const caso = CASOS.find((c) => c.id === trabajo.casoActual) ?? CASOS[0];
  if (!caso) return;
  const { data } = await supabase.from('plazos_legales').select('vence_en').eq('reclamo_id', caso.uuid).maybeSingle();
  if (data) trabajo.plazoLegalDias = diasHasta(data.vence_en);
}

/** Carga todo lo que las pantallas necesitan. Se llama al iniciar sesión y al volver a abrir la app. */
export async function cargarTodo() {
  if (!hayBaseDeDatos) return;
  await cargarReclamos();
  await Promise.all([cargarEvaluaciones(), cargarNotificaciones(), cargarDecisiones(), cargarPreferencias()]);
  await cargarPlazo();
}

// --------------------------------------------------------------------------- perfil y sesión
export async function perfilActual() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from('usuarios').select('id,nombre,correo,activo,roles(codigo)').eq('auth_id', user.id).maybeSingle();
  if (error || !data || !data.activo) return null;
  return { uid: data.id, nombre: data.nombre, correo: data.correo, rol: data.roles.codigo };
}

export async function entrar(correo, clave) {
  const { error } = await supabase.auth.signInWithPassword({ email: correo.trim().toLowerCase(), password: clave });
  if (error) return null;
  return perfilActual();
}
export const salir = () => (hayBaseDeDatos ? supabase.auth.signOut() : Promise.resolve());
export async function haySesionActiva() {
  if (!hayBaseDeDatos) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

// --------------------------------------------------------------------------- escritura
async function bitacora(reclamoUuid, accion, detalle) {
  const uid = obtenerSesion()?.uid;
  if (!uid) return;
  await supabase.from('bitacora').insert({ reclamo_id: reclamoUuid ?? null, usuario_id: uid, accion, detalle });
}
const uuidDe = (codigo) => CASOS.find((c) => c.id === codigo)?.uuid;

export async function registrarDecision({ caso, tipo, motivo, falsaAlarma }) {
  if (!hayBaseDeDatos) return;
  const reclamo = uuidDe(caso);
  const tipoBD = { Aprobado: 'Aprobar', Rechazado: 'Rechazar', 'Derivado a Legal': 'Derivar a Legal' }[tipo];
  lanzar(await supabase.from('decisiones').insert({ reclamo_id: reclamo, usuario_id: obtenerSesion().uid, tipo: tipoBD, justificacion: motivo, falsa_alarma: Boolean(falsaAlarma) }));
  lanzar(await supabase.from('reclamos').update({ estado: 'Decidido' }).eq('id', reclamo));
  await bitacora(reclamo, `Decisión: ${tipo}`, motivo);
  await Promise.all([cargarReclamos(), cargarDecisiones()]);
}

export async function crearReclamo({ poliza, reclamante, tipo, fechaHecho, monto, descripcion }) {
  if (!hayBaseDeDatos) return null;
  const { data: pol, error } = await supabase.from('polizas').select('id').eq('numero', poliza.trim().toUpperCase()).maybeSingle();
  lanzar({ error });
  if (!pol) throw new Error(`No existe la póliza ${poliza}. Revisa el número (formato PL-123456).`);
  const { data: ult } = await supabase.from('reclamos').select('codigo').order('codigo', { ascending: false }).limit(1);
  const numero = Number((ult?.[0]?.codigo ?? 'RCL-2060').slice(4)) + 1;
  const codigo = `RCL-${numero}`;
  const hoy = new Date();
  const vence = new Date(hoy.getTime() + 15 * 86400000).toISOString().slice(0, 10);
  const { data, error: e2 } = await supabase.from('reclamos').insert({
    codigo, poliza_id: pol.id, reclamante_nombre: reclamante, tipo, fecha_hecho: fechaHecho, fecha_denuncia: hoy.toISOString().slice(0, 10),
    monto_estimado: monto, descripcion: descripcion || null, plazo_vence: vence, analista_id: obtenerSesion().uid,
  }).select('id').single();
  lanzar({ error: e2 });
  await bitacora(data.id, 'Reclamo registrado', `${codigo} · ${tipo} · S/ ${monto}`);
  await cargarReclamos();
  return codigo;
}

export const recargarReclamos = () => cargarReclamos();

export async function crearEscalamiento({ caso, destinatarioCorreo, motivo, adjuntaResumen }) {
  if (!hayBaseDeDatos) return;
  const { data: dest, error } = await supabase.from('usuarios').select('id').eq('correo', destinatarioCorreo).maybeSingle();
  lanzar({ error });
  if (!dest) throw new Error('No se encontró a la persona elegida.');
  const reclamo = uuidDe(caso);
  lanzar(await supabase.from('escalamientos').insert({ reclamo_id: reclamo, de_usuario_id: obtenerSesion().uid, a_usuario_id: dest.id, motivo, adjunta_resumen: adjuntaResumen }));
  await bitacora(reclamo, 'Solicitud de apoyo', motivo);
}

export async function cambiarPlazo({ caso, accion, dias, motivo }) {
  if (!hayBaseDeDatos) return;
  const reclamo = uuidDe(caso);
  const { data: plazo, error } = await supabase.from('plazos_legales').select('id,vence_en').eq('reclamo_id', reclamo).maybeSingle();
  lanzar({ error });
  if (!plazo) throw new Error('Este caso aún no tiene un plazo legal registrado.');
  if (accion === 'extender') {
    const nuevo = new Date(new Date(`${plazo.vence_en}T00:00:00`).getTime() + dias * 86400000).toISOString().slice(0, 10);
    lanzar(await supabase.from('extensiones_plazo').insert({ plazo_id: plazo.id, dias, justificacion: motivo, usuario_id: obtenerSesion().uid }));
    lanzar(await supabase.from('plazos_legales').update({ vence_en: nuevo }).eq('id', plazo.id));
  } else {
    lanzar(await supabase.from('plazos_legales').update({ pausado: accion === 'pausar' }).eq('id', plazo.id));
  }
  await bitacora(reclamo, `Plazo legal: ${accion}`, motivo);
  await cargarPlazo();
}

/** Registros de la bitácora de un caso. Si el rol no puede leer la bitácora, se muestran sus decisiones. */
export async function bitacoraDe(codigo) {
  const reclamo = uuidDe(codigo) ?? (await supabase.from('reclamos').select('id').eq('codigo', codigo).maybeSingle()).data?.id;
  if (!reclamo) return [];
  const { data } = await supabase.from('bitacora').select('accion,detalle,creado_en,usuarios(nombre)').eq('reclamo_id', reclamo).order('creado_en', { ascending: false });
  if (data?.length) return data.map((b) => ({ cuando: b.creado_en, quien: b.usuarios?.nombre ?? 'Sistema', accion: b.accion, detalle: b.detalle ?? '' }));
  const { data: dec } = await supabase.from('decisiones').select('tipo,justificacion,creado_en,usuarios(nombre)').eq('reclamo_id', reclamo).order('creado_en', { ascending: false });
  return (dec ?? []).map((d) => ({ cuando: d.creado_en, quien: d.usuarios?.nombre ?? '—', accion: 'Decisión', detalle: `${d.tipo}: ${d.justificacion}` }));
}

async function idReclamo(codigo) {
  return uuidDe(codigo) ?? (await supabase.from('reclamos').select('id').eq('codigo', codigo).maybeSingle()).data?.id;
}
export async function documentosDe(codigo) {
  const id = await idReclamo(codigo);
  const { data } = await supabase.from('documentos').select('nombre,estado,tamano_bytes,hash_sha256,ruta_storage,autenticidad,autenticidad_detalle').eq('reclamo_id', id).order('creado_en');
  return data ?? [];
}
export async function buscarAsegurado(tipo, numero) {
  const { data } = await supabase.from('asegurados').select('nombre_completo,correo,telefono').eq('tipo_documento', tipo).eq('numero_documento', numero).maybeSingle();
  return data;
}
/** uuid y fecha del hecho de un reclamo (lo que necesita la verificación de adjuntos). */
export async function datosReclamo(codigo) {
  const { data } = await supabase.from('reclamos').select('id,fecha_hecho').eq('codigo', codigo).maybeSingle();
  return data ? { reclamoUuid: data.id, fechaHecho: data.fecha_hecho } : null;
}
/** Asegurado de la póliza del caso y su cruce con listas; deja constancia de cada consulta en la bitácora. */
export async function identidadDe(codigo, { registrar = false } = {}) {
  const id = await idReclamo(codigo);
  const { data: r } = await supabase.from('reclamos').select('reclamante_nombre,polizas(numero,asegurados(tipo_documento,numero_documento,nombre_completo))').eq('id', id).maybeSingle();
  const { data: listas } = await supabase.from('verificaciones_listas').select('persona,lista,resultado').eq('reclamo_id', id).order('creado_en');
  if (registrar) await bitacora(id, 'Consulta de identidad y listas', `${listas?.length ?? 0} verificaciones revisadas`);
  return { reclamante: r?.reclamante_nombre, asegurado: r?.polizas?.asegurados, poliza: r?.polizas?.numero, listas: listas ?? [], consultado: new Date() };
}
export async function inconsistenciasDe(codigo) {
  const id = await idReclamo(codigo);
  const { data } = await supabase.from('inconsistencias').select('id,descripcion,gravedad,revisada').eq('reclamo_id', id).order('creado_en');
  return data ?? [];
}
export async function marcarInconsistenciaRevisada(id) {
  lanzar(await supabase.from('inconsistencias').update({ revisada: true }).eq('id', id));
}
export async function similaresDe(codigo) {
  const id = await idReclamo(codigo);
  const { data } = await supabase.from('vinculos_reclamos')
    .select('motivo,similitud,vinculado:reclamo_vinculado_id(codigo,estado,fecha_hecho,decisiones(tipo))').eq('reclamo_id', id).order('similitud', { ascending: false });
  return (data ?? []).map((v) => ({ codigo: v.vinculado?.codigo, fecha: v.vinculado?.fecha_hecho, decision: v.vinculado?.decisiones?.[0]?.tipo, estado: v.vinculado?.estado, similitud: v.similitud, motivo: v.motivo }));
}

export async function marcarNotificaciones(ids) {
  if (!hayBaseDeDatos || !ids.length) return;
  await supabase.from('notificaciones').update({ leida: true }).in('id', ids);
}

// --------------------------------------------------------------------------- preferencias
async function cargarPreferencias() {
  const uid = obtenerSesion()?.uid;
  if (!uid) return;
  const { data } = await supabase.from('preferencias_usuario').select('*').eq('usuario_id', uid).maybeSingle();
  if (!data) return;
  cambiarPrefs({ tema: data.tema, texto: data.tamano_texto, contraste: data.contraste, sonido: data.sonido, sol: data.modo_sol }, { sinNube: true });
}

export async function guardarPreferencias(p) {
  const uid = obtenerSesion()?.uid;
  if (!hayBaseDeDatos || !uid) return;
  await supabase.from('preferencias_usuario').upsert({
    usuario_id: uid, tema: p.tema, modo_sol: Boolean(p.sol), tamano_texto: Math.min(150, Math.max(90, Math.round(p.texto))),
    contraste: Math.min(100, Math.max(0, Math.round(p.contraste))), sonido: Boolean(p.sonido),
  });
}
