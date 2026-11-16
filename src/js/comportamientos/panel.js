// Panel del analista: seleccionar una fila y abrir el caso elegido.
export default function panel(raiz, ctx) {
  const cuerpo = raiz.querySelector('tbody');
  const seleccionar = (fila) => {
    cuerpo.querySelectorAll('tr').forEach((f) => f.classList.toggle('seleccionada', f === fila));
    fila.querySelector('input[type="radio"]').checked = true;
  };
  cuerpo.addEventListener('click', (e) => {
    const fila = e.target.closest('tr');
    if (fila && !e.target.closest('a')) seleccionar(fila);
  });
  cuerpo.addEventListener('change', (e) => seleccionar(e.target.closest('tr')));
  raiz.querySelector('#abrir-caso').addEventListener('click', () => {
    const id = raiz.querySelector('input[name="caso"]:checked')?.value;
    if (id) ctx.ir(`/expediente/${id}/resumen`);
  });
}
