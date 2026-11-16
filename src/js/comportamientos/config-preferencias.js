// Preferencias de lectura (W-46): el cambio se ve al instante y se recuerda en este navegador.
import { cambiarPrefs, obtenerPrefs, restablecerPrefs, suscribir } from '../nucleo/almacen.js';
import { toast, anunciar } from '../nucleo/avisos.js';

const TEMAS = { Clara: 'clara', Cálida: 'calida', Oscura: 'oscura', 'Alto contraste': 'contraste' };

export default function preferencias(raiz) {
  const botones = [...raiz.querySelectorAll('.muestra')];
  const [rangoContraste, rangoTexto] = raiz.querySelectorAll('input[type="range"]');
  const resaltar = raiz.querySelector('.interruptor input');
  const modoSol = obtenerPrefs().sol;

  rangoTexto.min = 90; rangoTexto.max = 150; rangoTexto.step = 5; // tamaño del texto: del 90 % al 150 %
  rangoContraste.setAttribute('aria-label', 'Contraste');
  rangoTexto.setAttribute('aria-label', 'Tamaño del texto');

  const pintar = () => {
    const p = obtenerPrefs();
    botones.forEach((b) => {
      const activo = TEMAS[b.querySelector('small').textContent] === p.tema && !p.sol;
      b.setAttribute('aria-pressed', String(activo));
      b.classList.toggle('muestra--activa', activo);
    });
    rangoContraste.value = p.contraste;
    rangoTexto.value = p.texto;
    rangoTexto.setAttribute('aria-valuetext', `${p.texto} por ciento`);
    resaltar.checked = p.resaltar;
  };

  botones.forEach((b) => {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      cambiarPrefs({ tema: TEMAS[b.querySelector('small').textContent], sol: false });
      anunciar(`Paleta ${b.querySelector('small').textContent} aplicada.`);
    });
  });
  rangoContraste.addEventListener('input', () => cambiarPrefs({ contraste: Number(rangoContraste.value) }));
  rangoTexto.addEventListener('input', () => cambiarPrefs({ texto: Number(rangoTexto.value) }));
  resaltar.addEventListener('change', () => cambiarPrefs({ resaltar: resaltar.checked }));

  raiz.querySelector('[data-restablecer]').addEventListener('click', () => { restablecerPrefs(); toast('Preferencias restablecidas.', 'info'); });
  raiz.querySelector('[data-guardar]').addEventListener('click', () => toast('Preferencias guardadas en este navegador.', 'ok'));
  if (modoSol) raiz.querySelector('.pagina__titulo').insertAdjacentHTML('afterend',
    '<p class="aviso-sol">Modo sol activado: máximo contraste y bordes gruesos. El tamaño de la letra lo controlas tú con el deslizador «Tamaño del texto». Elige una paleta para volver a la vista normal.</p>');

  pintar();
  return suscribir((que) => que === 'prefs' && pintar());
}
