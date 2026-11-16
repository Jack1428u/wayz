// Calculadora de riesgo de multas (W-32): el porcentaje se recalcula al mover cada control.
export default function calculadora(raiz) {
  const rangos = [...raiz.querySelectorAll('input[type="range"]')];
  const valores = [...raiz.querySelectorAll('.deslizador b')];
  const dona = raiz.querySelector('.dona');
  const textoDona = dona.querySelector('span');
  textoDona.setAttribute('role', 'status');
  const barras = [...raiz.querySelectorAll('.factores .progreso > div')];

  const nivel = (v) => (v < 34 ? 'Baja' : v < 67 ? 'Media' : 'Alta');
  const formatos = [
    (v) => `S/ ${(v * 1000).toLocaleString('es-PE')}`,
    (v) => `${Math.round(v * 0.32)} días`,
    (v) => nivel(v),
    (v) => `${Math.round(v / 20)} en 12 meses`,
  ];
  const nombres = ['Monto reclamado', 'Días de retraso en la respuesta', 'Gravedad del incumplimiento', 'Antecedentes de sanciones'];

  function calcular() {
    const [m, d, g, a] = rangos.map((r) => Number(r.value));
    rangos.forEach((r, i) => {
      valores[i].textContent = formatos[i](Number(r.value));
      r.setAttribute('aria-label', nombres[i]);
      r.setAttribute('aria-valuetext', formatos[i](Number(r.value)));
    });
    const riesgo = Math.round(0.25 * m + 0.35 * d + 0.25 * g + 0.15 * a);
    textoDona.textContent = `${riesgo} %`;
    dona.style.background = `conic-gradient(var(--azul-oscuro) 0 ${riesgo}%, var(--pista) ${riesgo}% 100%)`;
    if (barras[0]) barras[0].style.width = `${d}%`;
    if (barras[1]) barras[1].style.width = `${a}%`;
  }
  rangos.forEach((r) => r.addEventListener('input', calcular));
  calcular();
}
