// Ventanas emergentes con el elemento nativo <dialog>.
// Ventajas de accesibilidad: atrapa el foco, bloquea el fondo, se cierra con Esc y devuelve el foco al botón que la abrió.

const modulos = import.meta.glob('../dialogos/*.js');
const abiertos = new Set();

export async function abrirDialogo(id, ctx = {}) {
  const cargar = modulos[`../dialogos/${id}.js`];
  if (!cargar) return console.warn(`No existe el diálogo «${id}»`);
  const mod = (await cargar()).default;

  const d = document.createElement('dialog');
  d.className = `dialogo ${mod.panel ? 'dialogo--panel' : ''} ${mod.clase ?? ''}`.trim();
  d.setAttribute('aria-labelledby', `dlg-${id}-titulo`);
  if (mod.ancho) d.style.setProperty('--ancho-dialogo', `${mod.ancho}px`);

  // El contenido sale de plantillas propias de la aplicación (no de texto escrito por el usuario).
  d.innerHTML = `
    <div class="dialogo__titulo">
      <h2 id="dlg-${id}-titulo">${mod.titulo(ctx)}</h2>
      <button type="button" class="dialogo__cerrar" data-cerrar aria-label="Cerrar ventana">×</button>
    </div>
    <div class="dialogo__cuerpo">${mod.render(ctx)}</div>`;
  document.body.append(d);
  abiertos.add(d);

  d.addEventListener('click', (e) => {
    if (e.target === d || e.target.closest('[data-cerrar]')) d.close('cancelar'); // clic fuera = cancelar
  });

  // La limpieza ocurre al cerrar por cualquier vía (botón, Esc, clic fuera) y solo una vez.
  let limpiar;
  let terminado = false;
  let resolver;
  const cerrada = new Promise((r) => { resolver = r; });
  const terminar = () => {
    if (terminado) return;
    terminado = true;
    limpiar?.();
    abiertos.delete(d);
    d.remove();
    resolver(d.returnValue || 'cancelar');
  };
  d.addEventListener('close', terminar);
  const cerrarNativo = d.close.bind(d);
  d.close = (valor) => { cerrarNativo(valor); terminar(); };

  d.showModal();
  limpiar = mod.init?.(d, ctx);
  return cerrada;
}

export function cerrarDialogos() {
  abiertos.forEach((d) => d.close('cancelar'));
}

/** Confirmación para acciones críticas (heurística 5: prevención de errores). Devuelve true/false. */
export async function confirmar({ titulo, mensaje, aceptar = 'Confirmar', peligro = false }) {
  const d = document.createElement('dialog');
  d.className = 'dialogo dialogo--confirmar';
  d.setAttribute('aria-labelledby', 'dlg-conf-titulo');
  d.setAttribute('aria-describedby', 'dlg-conf-texto');
  d.innerHTML = `
    <div class="dialogo__titulo"><h2 id="dlg-conf-titulo"></h2></div>
    <div class="dialogo__cuerpo">
      <p id="dlg-conf-texto"></p>
      <div class="modal__acciones">
        <button type="button" class="boton" value="cancelar" data-valor autofocus>Cancelar</button>
        <button type="button" class="boton ${peligro ? 'boton--peligro' : 'boton--primario'}" value="si" data-valor></button>
      </div>
    </div>`;
  d.querySelector('h2').textContent = titulo;
  d.querySelector('#dlg-conf-texto').textContent = mensaje;
  d.querySelector('[value="si"]').textContent = aceptar;
  d.addEventListener('click', (e) => {
    const b = e.target.closest('[data-valor]');
    if (b) d.close(b.value);
  });
  document.body.append(d);
  let resolver;
  const hecho = new Promise((r) => { resolver = r; });
  let terminado = false;
  const terminar = () => {
    if (terminado) return;
    terminado = true;
    resolver(d.returnValue === 'si');
    d.remove();
  };
  d.addEventListener('close', terminar);
  const cerrarNativo = d.close.bind(d);
  d.close = (valor) => { cerrarNativo(valor); terminar(); };
  d.showModal();
  return hecho;
}
