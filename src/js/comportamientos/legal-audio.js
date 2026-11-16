// Audio con transcripción sincronizada (W-25): reproducción simulada; hacer clic en una línea salta a ese segundo.
const TOTAL = 220; // 03:40
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function audio(raiz) {
  const lineas = [...raiz.querySelectorAll('.transcripcion li')];
  const tiempos = lineas.map((li) => { const [m, s] = li.querySelector('b').textContent.split(':').map(Number); return m * 60 + s; });
  const play = raiz.querySelector('[data-reproducir]');
  const reloj = raiz.querySelector('.reproductor__tiempo');
  const barras = [...raiz.querySelectorAll('.reproductor svg rect')];
  let t = 72; // 01:12
  let timer = null;

  function pintar() {
    reloj.textContent = `${mmss(t)} / ${mmss(TOTAL)}  1×`;
    const corte = Math.round((t / TOTAL) * barras.length);
    barras.forEach((b, i) => b.setAttribute('fill', i < corte ? '#1f2937' : '#cbd2dd'));
    let activa = 0;
    tiempos.forEach((s, i) => { if (s <= t) activa = i; });
    lineas.forEach((li, i) => li.classList.toggle('activa', i === activa));
  }
  const detener = () => { clearInterval(timer); timer = null; play.setAttribute('aria-pressed', 'false'); play.textContent = '▶'; play.setAttribute('aria-label', 'Reproducir'); };

  play.addEventListener('click', () => {
    if (timer) return detener();
    play.setAttribute('aria-pressed', 'true'); play.textContent = '❚❚'; play.setAttribute('aria-label', 'Pausar');
    timer = setInterval(() => { t = Math.min(TOTAL, t + 1); pintar(); if (t === TOTAL) detener(); }, 1000);
  });

  lineas.forEach((li, i) => {
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    const ir = () => { t = tiempos[i]; pintar(); };
    li.addEventListener('click', ir);
    li.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), ir()));
  });
  pintar();
  return detener;
}
