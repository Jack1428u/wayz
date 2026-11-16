// Aprobación automática (W-39): la simulación se recalcula con cada regla.
export default function automatizacion(raiz) {
  const general = raiz.querySelector('.interruptor input');
  const monto = raiz.querySelector('.campo input');
  const ramos = [...raiz.querySelectorAll('.fila-casillas input')];
  const condiciones = [...raiz.querySelectorAll('.reglas-sim .tarjeta > .casilla input')];
  const [kCasos, kAhorro] = raiz.querySelectorAll('.reglas-sim .kpi strong');
  const reglas = raiz.querySelector('.reglas-sim .tarjeta');

  monto.setAttribute('inputmode', 'numeric');
  function simular() {
    const importe = Number(String(monto.value).replace(/[^\d]/g, '')) || 0;
    const activos = ramos.filter((r) => r.checked).length;
    const cumplidas = condiciones.filter((c) => c.checked).length;
    const casos = general.checked ? Math.round((importe / 2000) * 128 * (activos / 2) * (cumplidas / 3)) : 0;
    kCasos.textContent = `${casos} / mes`;
    kAhorro.textContent = `S/ ${((casos * 45) / 1000).toFixed(1)} mil`;
    reglas.querySelectorAll('input').forEach((i) => (i.disabled = !general.checked));
  }
  raiz.addEventListener('input', simular);
  raiz.addEventListener('change', simular);
  simular();
}
