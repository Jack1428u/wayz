// Herramientas del agente: funciones que él decide cuándo usar.
// Cada una devuelve datos concretos (nunca opiniones), para que el resumen final se base en hechos.

import { CASOS } from '../src/datos/datos.js';
import { EXPEDIENTES } from './datos-agente.js';

let casosExtra = []; // reclamos que llegan mientras el agente vigila (ver ejecutar.js)
export const registrarCasosExtra = (lista, expedientes) => {
  casosExtra = lista;
  Object.assign(EXPEDIENTES, expedientes);
};

export const todosLosCasos = () => [...casosExtra, ...CASOS];
const caso = (id) => todosLosCasos().find((c) => c.id === id);
const expediente = (id) => EXPEDIENTES[id] ?? { diasDesdeInicioPoliza: 365, valorAsegurado: 20000, reclamosPrevios: 0, documentos: { entregados: [], faltantes: [] }, inconsistencias: [], listas: [], vinculos: [] };

const noExiste = (id) => ({ error: `No existe el reclamo ${id}.` });

// --- 1. Puntaje de riesgo (explicable: cada factor suma puntos visibles) ---------
export function calcular_riesgo({ caso_id }) {
  const c = caso(caso_id);
  if (!c) return noExiste(caso_id);
  const e = expediente(caso_id);
  const factores = [];
  const sumar = (puntos, motivo) => puntos > 0 && factores.push({ puntos, motivo });

  if (e.diasDesdeInicioPoliza < 60) sumar(20, `Siniestro ${e.diasDesdeInicioPoliza} días después de contratar la póliza`);
  if (c.monto > e.valorAsegurado) sumar(25, `Monto reclamado (S/ ${c.monto}) mayor al valor asegurado (S/ ${e.valorAsegurado})`);
  else if (c.monto > e.valorAsegurado * 0.8) sumar(10, 'Monto reclamado cercano al máximo asegurado');
  if (e.reclamosPrevios >= 2) sumar(15, `${e.reclamosPrevios} reclamos previos del mismo asegurado`);
  sumar(Math.min(15, e.documentos.faltantes.length * 5), `${e.documentos.faltantes.length} documento(s) faltante(s)`);
  sumar(Math.min(30, e.inconsistencias.length * 10), `${e.inconsistencias.length} inconsistencia(s) detectada(s)`);
  sumar(Math.min(24, e.vinculos.length * 12), `${e.vinculos.length} caso(s) vinculado(s) por datos en común`);
  if (e.listas.some((l) => l.tipo === 'confirmada')) sumar(40, 'Coincidencia confirmada en listas de sancionados');
  else if (e.listas.length) sumar(25, 'Posible coincidencia en listas de sancionados');

  const puntaje = Math.min(100, factores.reduce((s, f) => s + f.puntos, 0));
  return { caso_id, puntaje, factores };
}

// --- 2. Casos similares / redes sospechosas --------------------------------------
export function buscar_casos_similares({ caso_id }) {
  if (!caso(caso_id)) return noExiste(caso_id);
  const v = expediente(caso_id).vinculos;
  return { caso_id, cantidad: v.length, vinculos: v, hay_red_sospechosa: v.length >= 2 };
}

// --- 3. Documentos --------------------------------------------------------------
export function revisar_documentos({ caso_id }) {
  if (!caso(caso_id)) return noExiste(caso_id);
  const e = expediente(caso_id);
  return { caso_id, entregados: e.documentos.entregados, faltantes: e.documentos.faltantes, inconsistencias: e.inconsistencias };
}

// --- 4. Listas de sancionados ---------------------------------------------------
export function consultar_listas({ caso_id }) {
  if (!caso(caso_id)) return noExiste(caso_id);
  const l = expediente(caso_id).listas;
  return { caso_id, coincidencias: l, hay_coincidencia: l.length > 0 };
}

export const PRIORIDAD = (puntaje) => (puntaje >= 70 ? 'Crítica' : puntaje >= 45 ? 'Alta' : puntaje >= 25 ? 'Media' : 'Baja');

// --- 5. Acción final: dejar la evaluación registrada (el agente «actúa») ------------
export function registrar_evaluacion(datos) {
  return { registrado: true, ...datos };
}

export const IMPLEMENTACIONES = { calcular_riesgo, buscar_casos_similares, revisar_documentos, consultar_listas, registrar_evaluacion };

// Descripción de las herramientas para Gemini (function calling).
const porCaso = { type: 'OBJECT', properties: { caso_id: { type: 'STRING', description: 'Identificador del reclamo, por ejemplo RCL-2041' } }, required: ['caso_id'] };

export const DECLARACIONES = [
  { name: 'calcular_riesgo', description: 'Calcula el puntaje de riesgo de fraude (0 a 100) de un reclamo y lista los factores que lo explican.', parameters: porCaso },
  { name: 'buscar_casos_similares', description: 'Busca otros reclamos vinculados por teléfono, dirección o asegurado en común. Útil para detectar redes de fraude.', parameters: porCaso },
  { name: 'revisar_documentos', description: 'Devuelve los documentos entregados, los faltantes y las inconsistencias encontradas.', parameters: porCaso },
  { name: 'consultar_listas', description: 'Consulta si el reclamante o los beneficiarios aparecen en listas de sancionados o de lavado de activos.', parameters: porCaso },
  {
    name: 'registrar_evaluacion',
    description: 'ACCIÓN FINAL. Registra la evaluación del reclamo. Debe llamarse una sola vez, al terminar el análisis.',
    parameters: {
      type: 'OBJECT',
      properties: {
        caso_id: { type: 'STRING', description: 'Identificador del reclamo' },
        puntaje: { type: 'NUMBER', description: 'Puntaje de riesgo 0 a 100 (usa el de calcular_riesgo)' },
        prioridad: { type: 'STRING', description: 'Crítica, Alta, Media o Baja' },
        resumen: { type: 'STRING', description: 'Resumen de 2 a 3 frases para el analista, basado solo en datos de las herramientas' },
        motivos: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Hasta 4 motivos concretos de la prioridad' },
        accion_sugerida: { type: 'STRING', description: 'Siguiente paso recomendado para el analista (no una decisión final)' },
      },
      required: ['caso_id', 'puntaje', 'prioridad', 'resumen', 'motivos', 'accion_sugerida'],
    },
  },
];
