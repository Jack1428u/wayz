// Mapa de calor de cláusulas (W-27): filtrar por nivel de riesgo y ver el detalle de la cláusula elegida.
import { anunciar } from '../nucleo/avisos.js';

const DETALLE = {
  alto: { etiqueta: 'Ambigüedad: Alta', motivo: 'el término «pérdida total» puede interpretarse de dos maneras según la legislación local.' },
  medio: { etiqueta: 'Ambigüedad: Media', motivo: 'el plazo de notificación no indica si se cuenta en días hábiles o calendario.' },
  bajo: { etiqueta: 'Ambigüedad: Baja', motivo: 'la redacción es clara y coincide con la norma vigente.' },
};

export default function mapaCalor(raiz) {
  const clausulas = [...raiz.querySelectorAll('.clausula')];
  const nivelDe = (c) => ['alto', 'medio', 'bajo'].find((n) => c.querySelector('.barra-cl').classList.contains(`barra-cl--${n}`));
  const detalleTitulo = raiz.querySelector('.mapa aside h2');
  const etiqueta = raiz.querySelector('.mapa aside .etiqueta');
  const motivo = raiz.querySelector('.mapa aside .detalle');
  raiz.querySelector('.mapa aside').setAttribute('aria-live', 'polite');

  function elegir(c) {
    clausulas.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
    const d = DETALLE[nivelDe(c)];
    detalleTitulo.textContent = `${c.querySelector('span').textContent} seleccionada`;
    etiqueta.textContent = d.etiqueta;
    motivo.textContent = `Motivo: ${d.motivo}`;
  }
  clausulas.forEach((c) => {
    c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', () => elegir(c));
    c.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), elegir(c)));
  });

  raiz.querySelectorAll('.filtros-nivel [data-segmento]').forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.segmento.toLowerCase();
    let n = 0;
    clausulas.forEach((c) => { const ver = v === 'todos' || nivelDe(c) === v; c.hidden = !ver; if (ver) n++; });
    anunciar(`${n} ${n === 1 ? 'cláusula' : 'cláusulas'} con riesgo ${b.dataset.segmento}.`);
  }));
  elegir(clausulas[0]);
}
