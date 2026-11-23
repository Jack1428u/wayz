// Ejecuta el agente desde la terminal.
//   npm run agente            evalúa todos los reclamos y guarda el resultado
//   npm run agente:vigilar    queda trabajando solo: detecta reclamos nuevos en agente/bandeja-entrada.json
//   npm run agente -- --reglas   fuerza el modo sin IA

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { evaluarCaso } from './agente.js';
import { todosLosCasos, registrarCasosExtra } from './herramientas.js';
import { enviarAlertaAnalisis } from './notificador-email.js';

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const AQUI = dirname(fileURLToPath(import.meta.url));
const SALIDA = join(AQUI, '..', 'src', 'datos', 'resultados-agente.json');
const ENTRADA = join(AQUI, 'bandeja-entrada.json');

// Lee el archivo .env (sin librerías) para obtener la clave. La clave nunca se imprime ni se guarda en los resultados.
function cargarEnv() {
  const ruta = join(AQUI, '..', '.env');
  if (!existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(linea);
    if (m && !linea.trim().startsWith('#') && m[2] && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

async function crearCliente() {
  const clave = process.env.GEMINI_API_KEY;
  if (!clave) return null;
  const { GoogleGenAI } = await import('@google/genai');
  return new GoogleGenAI({ apiKey: clave });
}

const leerResultados = () => (existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, 'utf8')) : { evaluaciones: {} });
function guardar(resultados, modoGeneral, modelo) {
  const salida = { generado: new Date().toISOString(), modo: modoGeneral, modelo: modelo ?? null, evaluaciones: resultados.evaluaciones };
  writeFileSync(SALIDA, `${JSON.stringify(salida, null, 2)}\n`);
}

async function main() {
  cargarEnv();
  const args = process.argv.slice(2);
  const vigilar = args.includes('--vigilar');
  const forzarReglas = args.includes('--reglas');
  const modelo = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const pausaMs = Number(process.env.GEMINI_PAUSA_MS ?? 4000);
  const cliente = forzarReglas ? null : await crearCliente();

  console.log('=== Agente Wayz ===');
  console.log(cliente ? `Cerebro: Gemini (${modelo})` : 'Cerebro: reglas (sin IA). Para usar Gemini, pon tu clave en el archivo .env');

  const resultados = leerResultados();
  const procesar = async (id) => {
    console.log(`\n▶ Evaluando ${id}`);
    const e = await evaluarCaso(id, { cliente, modelo, forzarReglas, pausaMs });
    resultados.evaluaciones[id] = e;
    guardar(resultados, e.modo, e.modelo);
    console.log(`  → ${e.prioridad} (${e.puntaje}/100) [${e.modo}]`);
    console.log(`    ${e.resumen}`);
    console.log(`    Siguiente paso: ${e.accion}`);
    try {
      const envio = await enviarAlertaAnalisis(e);
      if (envio.ok) console.log(`    ✉ Alerta enviada (id: ${envio.id})`);
    } catch (err) {
      console.error(`    ! Fallo inesperado al notificar ${id}:`, err?.message ?? err);
    }
  };

  const casos = todosLosCasos();
  for (let i = 0; i < casos.length; i++) {
    await procesar(casos[i].id);
    if (i < casos.length - 1) await dormir(500); // respeta el Rate Limit de Resend (10 req/s)
  }

  if (!vigilar) { console.log(`\nListo. Resultados en src/datos/resultados-agente.json`); return; }

  // --- Modo autónomo: vigila la bandeja de entrada y atiende cada reclamo nuevo sin que nadie se lo pida ---
  console.log(`\n👁  Vigilando ${ENTRADA}\n   Agrega un reclamo nuevo al archivo y el agente lo evaluará solo. Ctrl+C para detener.`);
  const visto = new Set(Object.keys(resultados.evaluaciones));
  let ocupado = false;
  setInterval(async () => {
    if (ocupado || !existsSync(ENTRADA)) return;
    let entrantes;
    try { entrantes = JSON.parse(readFileSync(ENTRADA, 'utf8')); } catch { return; } // archivo a medio escribir
    const nuevos = entrantes.filter((x) => !visto.has(x.caso.id));
    if (!nuevos.length) return;
    ocupado = true;
    registrarCasosExtra(entrantes.map((x) => x.caso), Object.fromEntries(entrantes.map((x) => [x.caso.id, x.expediente])));
    for (let i = 0; i < nuevos.length; i++) {
      const n = nuevos[i];
      console.log(`\n📥 Llegó un reclamo nuevo: ${n.caso.id}`);
      await procesar(n.caso.id);
      visto.add(n.caso.id);
      if (i < nuevos.length - 1) await dormir(500);
    }
    ocupado = false;
  }, 3000);
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
