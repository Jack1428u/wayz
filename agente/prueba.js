// Prueba del agente SIN internet ni clave: un «Gemini simulado» pide herramientas igual que el real.
// Sirve para comprobar que el ciclo (pedir herramienta → recibir resultado → registrar evaluación) funciona.
//   npm run agente:prueba

import assert from 'node:assert/strict';
import { evaluarCaso, evaluarPorReglas } from './agente.js';

// Gemini simulado: primer turno pide dos herramientas; segundo turno registra la evaluación.
function geminiSimulado({ fallar = false } = {}) {
  let turno = 0;
  return {
    models: {
      async generateContent({ contents }) {
        if (fallar) { const e = new Error('cuota agotada'); e.status = 429; throw e; }
        const id = /RCL-\d+/.exec(contents[0].parts[0].text)[0];
        turno++;
        if (turno === 1) {
          const llamadas = [{ name: 'calcular_riesgo', args: { caso_id: id } }, { name: 'buscar_casos_similares', args: { caso_id: id } }];
          return { functionCalls: llamadas, candidates: [{ content: { role: 'model', parts: llamadas.map((functionCall) => ({ functionCall })) } }] };
        }
        const registro = { name: 'registrar_evaluacion', args: { caso_id: id, puntaje: 5, prioridad: 'Baja', resumen: 'Resumen escrito por el modelo.', motivos: ['Motivo A', 'Motivo B'], accion_sugerida: 'Revisar con el analista.' } };
        return { functionCalls: [registro], candidates: [{ content: { role: 'model', parts: [{ functionCall: registro }] } }] };
      },
    },
  };
}

const silencio = () => {};
let pruebas = 0;
const prueba = async (nombre, fn) => { await fn(); pruebas++; console.log(`  ✔ ${nombre}`); };

console.log('Pruebas del agente');

await prueba('modo reglas: caso con muchas señales es Crítico', () => {
  const e = evaluarPorReglas('RCL-2041');
  assert.equal(e.prioridad, 'Crítica');
  assert.ok(e.puntaje >= 70 && e.motivos.length > 0);
});

await prueba('modo reglas: caso limpio es Bajo', () => {
  assert.equal(evaluarPorReglas('RCL-2033').prioridad, 'Baja');
});

await prueba('modo reglas: reclamo inexistente da error claro', () => {
  assert.throws(() => evaluarPorReglas('RCL-0000'), /No existe/);
});

await prueba('con Gemini: usa herramientas y registra la evaluación', async () => {
  const e = await evaluarCaso('RCL-2038', { cliente: geminiSimulado(), modelo: 'simulado', registro: silencio });
  assert.equal(e.modo, 'gemini');
  assert.deepEqual(e.herramientas, ['calcular_riesgo', 'buscar_casos_similares']);
  assert.equal(e.resumen, 'Resumen escrito por el modelo.');
});

await prueba('con Gemini: el puntaje es el de la herramienta, no el que diga el modelo', async () => {
  const e = await evaluarCaso('RCL-2038', { cliente: geminiSimulado(), modelo: 'simulado', registro: silencio });
  assert.equal(e.puntaje, evaluarPorReglas('RCL-2038').puntaje); // el modelo dijo 5; la herramienta calculó otro
  assert.equal(e.prioridad, evaluarPorReglas('RCL-2038').prioridad);
});

await prueba('si Gemini falla (cuota), el agente cae a reglas y no deja el caso sin evaluar', async () => {
  const e = await evaluarCaso('RCL-2047', { cliente: geminiSimulado({ fallar: true }), modelo: 'simulado', registro: silencio });
  assert.equal(e.modo, 'reglas');
  assert.ok(e.resumen.length > 10);
});

console.log(`\n${pruebas} pruebas correctas.`);
