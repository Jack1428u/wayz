// Panel lateral: Asistente de póliza (wireframe W-13). Respuestas simuladas con cita de la cláusula.
import { trabajo } from '../nucleo/almacen.js';

const BASE = [
  { claves: ['robo parcial', 'accesorios'], texto: 'El robo de accesorios solo está cubierto si fueron declarados al contratar la póliza.', fuente: 'Condicionado, cláusula 4.2' },
  { claves: ['exclusion', 'exclusiones'], texto: 'Quedan excluidos el dolo del asegurado, la documentación adulterada y los hechos no declarados.', fuente: 'Condicionado, cláusulas 4.1, 4.2 y 4.5' },
  { claves: ['deducible'], texto: 'El deducible es del 10 % del monto indemnizable, con un mínimo de S/ 300.', fuente: 'Condiciones particulares, cláusula 6.1' },
];

export default {
  titulo: () => 'Asistente de póliza',
  panel: true,
  render: () => `
    <p class="asistente__contexto">Consultas sobre el expediente <strong>${trabajo.casoActual}</strong></p>
    <div class="sugerencias" role="group" aria-label="Preguntas sugeridas">
      <button type="button" data-pregunta="¿Cubre robo parcial?">¿Cubre robo parcial?</button>
      <button type="button" data-pregunta="Exclusiones">Exclusiones</button>
      <button type="button" data-pregunta="Deducible">Deducible</button>
    </div>
    <div class="chat" id="chat" role="log" aria-live="polite" aria-label="Conversación con el asistente"></div>
    <form class="asistente__entrada" id="f-asistente" data-propio>
      <label class="solo-lectores" for="pregunta">Escribe tu consulta sobre la póliza</label>
      <input id="pregunta" type="text" placeholder="Escribe tu consulta sobre la póliza" autocomplete="off">
      <button type="submit" class="boton boton--primario">Enviar</button>
    </form>`,
  init(d) {
    const chat = d.querySelector('#chat');
    const agregar = (clase, texto, fuente) => {
      const p = document.createElement('p');
      p.className = `burbuja burbuja--${clase}`;
      p.textContent = texto;
      chat.append(p);
      if (fuente) {
        const f = document.createElement('p');
        f.className = 'fuente';
        f.textContent = `Fuente: ${fuente}`;
        chat.append(f);
      }
      chat.scrollTop = chat.scrollHeight;
    };
    const preguntar = (texto) => {
      if (!texto.trim()) return;
      agregar('usuario', texto);
      const q = texto.toLowerCase();
      const r = BASE.find((b) => b.claves.some((c) => q.includes(c)));
      setTimeout(() => (r
        ? agregar('ia', `Respuesta: ${r.texto}`, r.fuente)
        : agregar('ia', 'No encontré esa información en la póliza. Prueba con «exclusiones» o «deducible», o consulta con el área legal.')), 400);
    };
    d.querySelectorAll('[data-pregunta]').forEach((b) => b.addEventListener('click', () => preguntar(b.dataset.pregunta)));
    d.querySelector('#f-asistente').addEventListener('submit', (e) => {
      e.preventDefault();
      const campo = d.querySelector('#pregunta');
      preguntar(campo.value);
      campo.value = '';
    });
  },
};
