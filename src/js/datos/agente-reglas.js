// Agente dentro de la app (modo reglas): evalúa un reclamo apenas se registra o cambia su documentación.
// Usa las MISMAS reglas que agente/herramientas.js, pero leyendo los datos reales de la base.
// Sus resultados son sugerencias: el analista siempre decide. (Con Gemini se enriquece desde la terminal: npm run agente.)
import { supabase } from './supabase.js';
import { fusionarEvaluaciones } from './agente.js';

const ACCION = {
  Crítica: 'Revisar hoy con prioridad. Verificar los casos vinculados y evaluar derivar a Legal antes de pagar.',
  Alta: 'Revisar en el día y confirmar las señales detectadas antes de decidir.',
  Media: 'Revisar con calma. Completar la documentación pendiente.',
  Baja: 'Sin señales de alerta. Puede seguir el trámite normal.',
};
export const prioridadDe = (p) => (p >= 70 ? 'Crítica' : p >= 45 ? 'Alta' : p >= 25 ? 'Media' : 'Baja');
const NIVEL = { Crítica: ['Alto', 'Alta'], Alta: ['Alto', 'Alta'], Media: ['Medio', 'Media'], Baja: ['Bajo', 'Baja'] };
const dias = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);

export async function evaluarReclamo(codigo) {
  const { data: r, error } = await supabase.from('reclamos')
    .select('id,codigo,monto_estimado,fecha_hecho,polizas(id,fecha_inicio,valor_asegurado,asegurado_id)').eq('codigo', codigo).single();
  if (error) throw new Error(error.message);
  const poliza = r.polizas;
  const [previos, docs, incons, vinculos, listas] = await Promise.all([
    supabase.from('reclamos').select('id,polizas!inner(asegurado_id)', { count: 'exact', head: true }).eq('polizas.asegurado_id', poliza.asegurado_id).neq('id', r.id),
    supabase.from('documentos').select('estado').eq('reclamo_id', r.id),
    supabase.from('inconsistencias').select('id').eq('reclamo_id', r.id),
    supabase.from('vinculos_reclamos').select('id').eq('reclamo_id', r.id),
    supabase.from('verificaciones_listas').select('resultado').eq('reclamo_id', r.id),
  ]);

  const monto = Number(r.monto_estimado);
  const valor = Number(poliza.valor_asegurado);
  const desdeInicio = dias(r.fecha_hecho, poliza.fecha_inicio);
  const faltantes = (docs.data ?? []).filter((d) => d.estado === 'Faltante').length;
  const nIncons = incons.data?.length ?? 0;
  const nVinc = vinculos.data?.length ?? 0;
  const coinc = (listas.data ?? []).filter((l) => l.resultado !== 'Sin coincidencia');
  const nPrevios = previos.count ?? 0;

  const factores = [];
  const sumar = (puntos, motivo) => puntos > 0 && factores.push({ puntos, motivo });
  if (desdeInicio >= 0 && desdeInicio < 60) sumar(20, `Siniestro ${desdeInicio} días después de contratar la póliza`);
  if (monto > valor) sumar(25, `Monto reclamado (S/ ${monto}) mayor al valor asegurado (S/ ${valor})`);
  else if (monto > valor * 0.8) sumar(10, 'Monto reclamado cercano al máximo asegurado');
  if (nPrevios >= 2) sumar(15, `${nPrevios} reclamos previos del mismo asegurado`);
  sumar(Math.min(15, faltantes * 5), `${faltantes} documento(s) faltante(s)`);
  sumar(Math.min(30, nIncons * 10), `${nIncons} inconsistencia(s) detectada(s)`);
  sumar(Math.min(24, nVinc * 12), `${nVinc} caso(s) vinculado(s) por datos en común`);
  if (coinc.some((l) => l.resultado === 'Coincidencia confirmada')) sumar(40, 'Coincidencia confirmada en listas de sancionados');
  else if (coinc.length) sumar(25, 'Posible coincidencia en listas de sancionados');

  const puntaje = Math.min(100, factores.reduce((s, f) => s + f.puntos, 0));
  const prioridad = prioridadDe(puntaje);
  const motivos = [...factores].sort((a, b) => b.puntos - a.puntos).slice(0, 4).map((f) => f.motivo);
  const resumen = motivos.length
    ? `Prioridad ${prioridad.toLowerCase()} (${puntaje}/100). Señales principales: ${motivos.slice(0, 2).join('; ')}.`
    : `Prioridad baja (${puntaje}/100). No se encontraron señales de alerta.`;
  const herramientas = ['calcular_riesgo', 'buscar_casos_similares', 'revisar_documentos', 'consultar_listas'];

  const fila = { reclamo_id: r.id, puntaje, prioridad, resumen, motivos, accion_sugerida: ACCION[prioridad], herramientas, modo: 'reglas', modelo: null };
  const { error: e1 } = await supabase.from('evaluaciones_agente').insert(fila);
  if (e1) throw new Error(e1.message);
  // El agente deja el caso priorizado: ajusta el riesgo y la urgencia que ve el analista en la bandeja.
  await supabase.from('reclamos').update({ riesgo: NIVEL[prioridad][0], urgencia: NIVEL[prioridad][1] }).eq('id', r.id);

  const evaluacion = { id: codigo, puntaje, prioridad, resumen, motivos, accion: ACCION[prioridad], herramientas, modo: 'reglas', fecha: new Date().toISOString() };
  fusionarEvaluaciones({ [codigo]: evaluacion });
  return evaluacion;
}
