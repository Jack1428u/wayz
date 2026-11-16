// Desempeño de terceros (W-36): alterna entre peritos y estudios jurídicos.
export default function terceros(raiz) {
  const grupo = raiz.querySelector('.segmentos');
  grupo.dataset.filtro = 'no'; // este grupo no filtra filas: muestra una sección u otra
  const titulos = [...raiz.querySelectorAll('.subtitulo-seccion')];
  const secciones = titulos.map((h) => [h, h.nextElementSibling]);

  function mostrar(indice) {
    secciones.forEach(([h, s], i) => { h.hidden = s.hidden = i !== indice; });
  }
  grupo.querySelectorAll('[data-segmento]').forEach((b, i) => b.addEventListener('click', () => mostrar(i)));
  mostrar(0);
}
