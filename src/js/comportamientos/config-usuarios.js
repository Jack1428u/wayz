// Usuarios y accesos (W-43): elegir un usuario y editar su rol y permisos.
import { toast } from '../nucleo/avisos.js';

const PERMISOS_POR_ROL = {
  Analista: ['Reclamos', 'Historial'], 'Asesor legal': ['Área legal', 'Historial'], Gerente: ['Reclamos', 'Historial', 'Gerencia'],
};

export default function usuarios(raiz) {
  const filas = [...raiz.querySelectorAll('.accesos .tarjeta:first-child tbody tr')];
  const form = raiz.querySelector('form.tarjeta');
  form.dataset.propio = '1';
  const titulo = form.querySelector('.usuario-sel');
  const rol = form.querySelector('select');
  const casillas = [...form.querySelectorAll('.casilla input')];
  let actual = filas[0];

  rol.innerHTML = Object.keys(PERMISOS_POR_ROL).map((r) => `<option>${r}</option>`).join('');
  const marcar = (r) => casillas.forEach((c) => (c.checked = PERMISOS_POR_ROL[r]?.includes(c.parentElement.textContent.trim()) ?? false));

  function elegir(fila) {
    actual = fila;
    filas.forEach((f) => f.classList.toggle('seleccionada', f === fila));
    titulo.textContent = fila.cells[0].textContent;
    rol.value = PERMISOS_POR_ROL[fila.cells[1].textContent] ? fila.cells[1].textContent : 'Analista';
    marcar(rol.value);
  }
  filas.forEach((f) => {
    f.tabIndex = 0;
    f.addEventListener('click', () => elegir(f));
    f.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), elegir(f)));
  });
  rol.addEventListener('change', () => marcar(rol.value));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    actual.cells[1].textContent = rol.value;
    toast(`Permisos de ${actual.cells[0].textContent} guardados. El cambio queda registrado.`, 'ok');
  });
  elegir(actual);
}
