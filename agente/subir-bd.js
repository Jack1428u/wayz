// Sube a la base de datos las evaluaciones del agente (src/datos/resultados-agente.json).
//   npm run agente:subir
// El agente entra con su propia cuenta (rol «técnico»), que es la única autorizada a guardar evaluaciones.
// Lee la URL y la clave pública de .env.local y, opcionalmente, AGENTE_CORREO / AGENTE_CLAVE de .env.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

function cargarEnv(nombre) {
  const ruta = join(RAIZ, nombre);
  if (!existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(linea);
    if (m && !linea.trim().startsWith('#') && m[2] && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
cargarEnv('.env.local');
cargarEnv('.env');

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_PUBLISHABLE_KEY: clave } = process.env;
if (!url || !clave) { console.error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env.local'); process.exit(1); }

const supabase = createClient(url, clave, { auth: { persistSession: false } });
const { error: errorLogin } = await supabase.auth.signInWithPassword({
  email: process.env.AGENTE_CORREO || 'tecnico@wayz.demo',
  password: process.env.AGENTE_CLAVE,
});
if (errorLogin) { console.error(`El agente no pudo entrar: ${errorLogin.message}`); process.exit(1); }

const resultados = JSON.parse(readFileSync(join(RAIZ, 'src', 'datos', 'resultados-agente.json'), 'utf8'));
const { data: reclamos, error } = await supabase.from('reclamos').select('id,codigo');
if (error) { console.error(error.message); process.exit(1); }
const idDe = Object.fromEntries(reclamos.map((r) => [r.codigo, r.id]));

const filas = Object.values(resultados.evaluaciones)
  .filter((e) => idDe[e.id])
  .map((e) => ({
    reclamo_id: idDe[e.id], puntaje: e.puntaje, prioridad: e.prioridad, resumen: e.resumen, motivos: e.motivos ?? [],
    accion_sugerida: e.accion, herramientas: e.herramientas ?? [], modo: e.modo, modelo: e.modelo ?? resultados.modelo ?? null,
  }));
const omitidos = Object.keys(resultados.evaluaciones).length - filas.length;

const { error: errorInsertar } = await supabase.from('evaluaciones_agente').insert(filas);
if (errorInsertar) { console.error(errorInsertar.message); process.exit(1); }
console.log(`✔ ${filas.length} evaluaciones guardadas en la base de datos${omitidos ? ` (${omitidos} omitidas: ese reclamo no existe en la base)` : ''}.`);
await supabase.auth.signOut();
