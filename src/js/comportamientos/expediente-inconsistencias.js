// Inconsistencias del expediente (W-10): lista real y «Marcar revisada» guardado en la base de datos.
import { hayBaseDeDatos } from '../datos/supabase.js';
import { inconsistenciasDe, marcarInconsistenciaRevisada } from '../datos/repositorio.js';
import { toast } from '../nucleo/avisos.js';

const CLASE = { Alta: 'rojo', Media: 'ambar', Baja: 'verde' };

export default function inconsistencias(raiz, ctx) {
  if (!hayBaseDeDatos) return;
  const lista = raiz.querySelector('.lista-incons');
  const titulo = raiz.querySelector('.subtitulo-seccion');
  const boton = raiz.querySelector('.acciones-incons button');
  let datos = [];
  let elegida = null;

  const pintar = () => {
    lista.replaceChildren();
    const pendientes = datos.filter((d) => !d.revisada).length;
    titulo.textContent = datos.length ? `Se detectaron ${datos.length} posibles inconsistencias (${pendientes} sin revisar)` : 'No se detectaron inconsistencias';
    datos.forEach((d) => {
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.setAttribute('aria-current', String(d === elegida));
      if (d === elegida) li.classList.add('seleccionada');
      const caja = document.createElement('div');
      caja.append(Object.assign(document.createElement('b'), { textContent: d.descripcion }), Object.assign(document.createElement('small'), { textContent: `Gravedad ${d.gravedad.toLowerCase()}${d.revisada ? ' · revisada' : ''}` }));
      li.append(Object.assign(document.createElement('span'), { className: 'icono-doc', textContent: '▤' }), caja,
        Object.assign(document.createElement('span'), { className: `etiqueta etiqueta--${d.revisada ? 'gris' : CLASE[d.gravedad]}`, textContent: d.revisada ? 'Revisada' : d.gravedad }));
      const elegir = () => { elegida = d; pintar(); };
      li.addEventListener('click', elegir);
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(); } });
      lista.append(li);
    });
  };

  boton.removeAttribute('data-accion');
  boton.addEventListener('click', async () => {
    if (!elegida) return toast('Elige primero una inconsistencia de la lista.', 'alerta');
    try {
      await marcarInconsistenciaRevisada(elegida.id);
      elegida.revisada = true;
      toast('Inconsistencia marcada como revisada.', 'ok');
      pintar();
    } catch (err) {
      toast(`No se pudo guardar: ${err.message}`, 'alerta');
    }
  });

  inconsistenciasDe(ctx.params.caso).then((d) => { datos = d; pintar(); }).catch(() => {});
}
