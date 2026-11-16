// Adjuntos reales: subida a Supabase Storage + verificación de autenticidad (a escala mínima, explicable).
// Qué se comprueba (todo en el navegador, sin servicios externos):
//   1. Huella SHA-256 del archivo.
//   2. ¿El contenido real coincide con la extensión? (un .pdf que en realidad es otra cosa es sospechoso)
//   3. ¿El mismo archivo (misma huella) ya se usó en OTRO reclamo? (documento reutilizado)
//   4. ¿El archivo fue creado antes del siniestro? (fecha de modificación anterior al hecho)
//   5. En PDF: ¿lo guardó un programa de edición de imágenes o de retoque? (Photoshop, Canva, GIMP…)
// El resultado es una ALERTA para el analista, no una sentencia: él decide.
import { supabase } from './supabase.js';
import { obtenerSesion } from '../nucleo/almacen.js';

export const MAX_BYTES = 20 * 1024 * 1024;
const TIPOS = {
  pdf: { mime: 'application/pdf', firma: [0x25, 0x50, 0x44, 0x46] },
  png: { mime: 'image/png', firma: [0x89, 0x50, 0x4e, 0x47] },
  jpg: { mime: 'image/jpeg', firma: [0xff, 0xd8, 0xff] },
  jpeg: { mime: 'image/jpeg', firma: [0xff, 0xd8, 0xff] },
  zip: { mime: 'application/zip', firma: [0x50, 0x4b, 0x03, 0x04] },
  txt: { mime: 'text/plain', firma: null },
};
export const EXTENSIONES = Object.keys(TIPOS).map((e) => `.${e}`).join(',');
const EDITORES = /photoshop|canva|gimp|ilovepdf|smallpdf|sejda|pixlr|paint\.net/i;

const extension = (nombre) => (nombre.includes('.') ? nombre.split('.').pop().toLowerCase() : '');

export async function huella(archivo) {
  const hash = await crypto.subtle.digest('SHA-256', await archivo.arrayBuffer());
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Devuelve { resultado: 'Verificado'|'Sospechoso', hallazgos: [{texto, grave}], hash, mime } */
export async function analizarArchivo(archivo, { fechaHecho, reclamoUuid } = {}) {
  const ext = extension(archivo.name);
  const tipo = TIPOS[ext];
  const hallazgos = [];
  if (!tipo) return { resultado: 'Sospechoso', hash: null, mime: null, hallazgos: [{ texto: `Tipo de archivo no admitido (.${ext || 'sin extensión'}). Usa PDF, imagen, ZIP o TXT.`, grave: true }], rechazado: true };
  if (archivo.size > MAX_BYTES) return { resultado: 'Sospechoso', hash: null, mime: tipo.mime, hallazgos: [{ texto: 'El archivo supera los 20 MB permitidos.', grave: true }], rechazado: true };

  const hash = await huella(archivo);
  const inicio = new Uint8Array(await archivo.slice(0, 8).arrayBuffer());
  if (tipo.firma && !tipo.firma.every((b, i) => inicio[i] === b)) {
    hallazgos.push({ texto: `La extensión .${ext} no coincide con el contenido real del archivo (posible falsificación).`, grave: true });
  }

  if (supabase) {
    const { data } = await supabase.from('documentos').select('nombre,reclamos(id,codigo)').eq('hash_sha256', hash);
    const otros = (data ?? []).filter((d) => d.reclamos && d.reclamos.id !== reclamoUuid);
    if (otros.length) hallazgos.push({ texto: `Este mismo archivo ya fue presentado en ${[...new Set(otros.map((o) => o.reclamos.codigo))].join(', ')}.`, grave: true });
  }

  if (fechaHecho && archivo.lastModified && new Date(archivo.lastModified) < new Date(`${fechaHecho}T00:00:00`)) {
    hallazgos.push({ texto: `El archivo se modificó por última vez el ${new Date(archivo.lastModified).toLocaleDateString('es-PE')}, antes del siniestro (${fechaHecho.split('-').reverse().join('/')}).`, grave: false });
  }

  if (ext === 'pdf' && !hallazgos.some((h) => h.grave)) {
    const cola = await archivo.slice(Math.max(0, archivo.size - 8192)).text();
    const productor = /\/(Producer|Creator)\s*\(([^)]*)\)/g;
    // Un PDF suele declarar el mismo programa en «Producer» y en «Creator»: se avisa una sola vez por programa.
    const programas = new Set([...cola.matchAll(productor)].map((m) => m[2].trim()).filter((nombre) => EDITORES.test(nombre)));
    programas.forEach((nombre) => hallazgos.push({ texto: `El PDF fue guardado con «${nombre}», un programa de edición de imágenes.`, grave: false }));
  }

  return { resultado: hallazgos.length ? 'Sospechoso' : 'Verificado', hash, mime: tipo.mime, hallazgos };
}

const resumen = (a) => (a.hallazgos.length ? a.hallazgos.map((h) => h.texto).join(' ') : 'Sin hallazgos: tipo coincide, no es duplicado y la fecha es coherente.');

/** Analiza, sube a Storage, registra en `documentos` y, si es sospechoso, crea una inconsistencia y avisa en la bitácora. */
export async function subirAdjunto({ codigo, reclamoUuid, fechaHecho, archivo }) {
  const analisis = await analizarArchivo(archivo, { fechaHecho, reclamoUuid });
  if (analisis.rechazado) throw new Error(analisis.hallazgos[0].texto);

  const limpio = archivo.name.replace(/[^\w.\-]+/g, '_');
  const ruta = `${codigo}/${analisis.hash.slice(0, 10)}-${limpio}`;
  const { error: errorSubida } = await supabase.storage.from('documentos').upload(ruta, archivo, { contentType: analisis.mime, upsert: true });
  if (errorSubida) {
    // Heurística 9: mensaje en lenguaje claro y con una salida, no el texto técnico de la base de datos.
    const permiso = /row-level security|not authorized|permission/i.test(errorSubida.message);
    throw new Error(permiso
      ? 'Tu rol no tiene permiso para subir adjuntos. Pide a un analista o líder que lo haga.'
      : `No se pudo subir el archivo (${errorSubida.message}). Revisa tu conexión e inténtalo otra vez.`);
  }

  const { error } = await supabase.from('documentos').insert({
    reclamo_id: reclamoUuid, nombre: archivo.name, estado: 'Entregado', tamano_bytes: archivo.size, hash_sha256: analisis.hash, ruta_storage: ruta,
    tipo_mime: analisis.mime, archivo_modificado_en: archivo.lastModified ? new Date(archivo.lastModified).toISOString() : null,
    autenticidad: analisis.resultado, autenticidad_detalle: resumen(analisis),
  });
  if (error) throw new Error(error.message);

  const uid = obtenerSesion()?.uid;
  if (analisis.resultado === 'Sospechoso') {
    await supabase.from('inconsistencias').insert({
      reclamo_id: reclamoUuid, descripcion: `Documento «${archivo.name}»: ${resumen(analisis)}`.slice(0, 400),
      gravedad: analisis.hallazgos.some((h) => h.grave) ? 'Alta' : 'Media',
    });
  }
  if (uid) await supabase.from('bitacora').insert({ reclamo_id: reclamoUuid, usuario_id: uid, accion: `Adjunto ${analisis.resultado.toLowerCase()}`, detalle: `${archivo.name} · SHA-256 ${analisis.hash.slice(0, 12)}…` });
  return analisis;
}

export async function enlaceTemporal(ruta) {
  const { data } = await supabase.storage.from('documentos').createSignedUrl(ruta, 120);
  return data?.signedUrl ?? null;
}
