// Agente Wayz: recibe un objetivo («evalúa este reclamo»), decide qué herramientas usar y en qué orden,
// y termina registrando una evaluación para el analista. Un humano siempre toma la decisión final.
//
// Cerebro: Gemini con «function calling». Si no hay clave o falla la conexión, trabaja con reglas
// (las mismas herramientas, sin IA), así la demostración nunca se cae.

import { DECLARACIONES, IMPLEMENTACIONES, PRIORIDAD, calcular_riesgo, buscar_casos_similares, revisar_documentos, consultar_listas } from './herramientas.js';

const SISTEMA = `Eres el Agente Wayz, un asistente que ayuda a analistas de una aseguradora a detectar posibles fraudes.
OBJETIVO: evaluar un reclamo y dejarlo priorizado, con un resumen claro para el analista.
CÓMO TRABAJAS:
1. Siempre empieza con calcular_riesgo.
2. Decide tú qué más revisar: si el puntaje es 25 o más, usa también buscar_casos_similares, revisar_documentos y consultar_listas según lo que necesites. Si el puntaje es bajo, no gastes pasos innecesarios.
3. Al terminar, llama UNA sola vez a registrar_evaluacion.
REGLAS:
- Usa solo datos que devolvieron las herramientas. No inventes nada.
- No decides aprobar ni rechazar un reclamo: solo recomiendas el siguiente paso al analista.
- Escribe en español, con frases cortas y sin tecnicismos.
- La prioridad debe ser coherente con el puntaje: Crítica (70+), Alta (45-69), Media (25-44), Baja (0-24).`;

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const ACCION = {
  Crítica: 'Revisar hoy con prioridad. Verificar los casos vinculados y evaluar derivar a Legal antes de pagar.',
  Alta: 'Revisar en el día y confirmar las señales detectadas antes de decidir.',
  Media: 'Revisar con calma. Completar la documentación pendiente.',
  Baja: 'Sin señales de alerta. Puede seguir el trámite normal.',
};

// --- Modo reglas: las mismas herramientas, sin IA ---------------------------------
export function evaluarPorReglas(id) {
  const riesgo = calcular_riesgo({ caso_id: id });
  if (riesgo.error) throw new Error(riesgo.error);
  const similares = buscar_casos_similares({ caso_id: id });
  const docs = revisar_documentos({ caso_id: id });
  const listas = consultar_listas({ caso_id: id });
  const prioridad = PRIORIDAD(riesgo.puntaje);
  const motivos = [...riesgo.factores].sort((a, b) => b.puntos - a.puntos).slice(0, 4).map((f) => f.motivo);
  const resumen = motivos.length
    ? `Prioridad ${prioridad.toLowerCase()} (${riesgo.puntaje}/100). Señales principales: ${motivos.slice(0, 2).join('; ')}.`
    : `Prioridad baja (${riesgo.puntaje}/100). No se encontraron señales de alerta.`;
  return {
    id, puntaje: riesgo.puntaje, prioridad, resumen, motivos, accion: ACCION[prioridad],
    herramientas: ['calcular_riesgo', 'buscar_casos_similares', 'revisar_documentos', 'consultar_listas'],
    modo: 'reglas', redSospechosa: similares.hay_red_sospechosa, documentosFaltantes: docs.faltantes.length, coincidenciaListas: listas.hay_coincidencia,
  };
}

// --- Modo Gemini: el modelo decide qué herramientas usar --------------------------
export async function evaluarConGemini(id, { cliente, modelo, maxPasos = 8, pausaMs = 0, registro = () => {} }) {
  const contenido = [{ role: 'user', parts: [{ text: `Evalúa el reclamo ${id}.` }] }];
  const usadas = [];
  let final = null;
  let riesgoCalculado = null;

  for (let paso = 1; paso <= maxPasos && !final; paso++) {
    const respuesta = await cliente.models.generateContent({
      model: modelo,
      contents: contenido,
      config: { systemInstruction: SISTEMA, tools: [{ functionDeclarations: DECLARACIONES }], temperature: 0.2 },
    });
    const llamadas = respuesta.functionCalls ?? [];
    const turnoModelo = respuesta.candidates?.[0]?.content;
    if (turnoModelo) contenido.push(turnoModelo);

    if (!llamadas.length) {
      // El modelo contestó con texto: se le recuerda que debe registrar la evaluación.
      contenido.push({ role: 'user', parts: [{ text: 'Registra ahora tu evaluación llamando a registrar_evaluacion.' }] });
      continue;
    }

    const resultados = [];
    for (const { name, args } of llamadas) {
      const funcion = IMPLEMENTACIONES[name];
      const salida = funcion ? funcion(args ?? {}) : { error: `Herramienta desconocida: ${name}` };
      usadas.push(name);
      registro(`   · ${name}(${args?.caso_id ?? ''})`);
      if (name === 'calcular_riesgo' && typeof salida.puntaje === 'number') riesgoCalculado = salida.puntaje;
      if (name === 'registrar_evaluacion') final = args;
      resultados.push({ functionResponse: { name, response: { resultado: salida } } });
    }
    contenido.push({ role: 'user', parts: resultados });
    if (pausaMs) await dormir(pausaMs); // respeta el límite de peticiones de la capa gratuita
  }

  if (!final) throw new Error('El agente no llegó a registrar la evaluación.');

  // Salvaguarda: el puntaje siempre es el de la herramienta (el modelo explica, no inventa cifras).
  const puntaje = riesgoCalculado ?? calcular_riesgo({ caso_id: id }).puntaje ?? Number(final.puntaje) ?? 0;
  const prioridad = PRIORIDAD(puntaje);
  return {
    id, puntaje, prioridad,
    resumen: String(final.resumen ?? '').trim() || evaluarPorReglas(id).resumen,
    motivos: (Array.isArray(final.motivos) ? final.motivos : []).slice(0, 4).map(String),
    accion: String(final.accion_sugerida ?? '').trim() || ACCION[prioridad],
    herramientas: [...new Set(usadas)].filter((n) => n !== 'registrar_evaluacion'),
    modo: 'gemini', modelo,
  };
}

/** Evalúa un reclamo: con Gemini si se puede; si no, con reglas. Nunca deja un caso sin evaluar. */
export async function evaluarCaso(id, { cliente = null, modelo, forzarReglas = false, pausaMs = 0, registro = console.log } = {}) {
  let evaluacion;
  if (cliente && !forzarReglas) {
    try {
      evaluacion = await evaluarConGemini(id, { cliente, modelo, pausaMs, registro });
    } catch (error) {
      // Se muestra el motivo sin datos sensibles (nunca se imprime la clave).
      registro(`   ! Gemini no respondió (${error.status ?? ''} ${String(error.message).slice(0, 90)}). Se usan las reglas.`);
    }
  }
  evaluacion ??= evaluarPorReglas(id);
  return { ...evaluacion, fecha: new Date().toISOString() };
}
