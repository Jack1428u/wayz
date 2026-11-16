// Identidad y listas (W-11): datos del asegurado y cruce con listas desde la base de datos.
import { hayBaseDeDatos } from '../datos/supabase.js';
import { identidadDe } from '../datos/repositorio.js';
import { toast, anunciar } from '../nucleo/avisos.js';

const CLASE = { 'Sin coincidencia': 'verde', 'Coincidencia posible': 'ambar', 'Coincidencia confirmada': 'rojo' };

export default function identidad(raiz, ctx) {
  if (!hayBaseDeDatos) return;
  const datos = raiz.querySelector('dl.datos');
  const sello = raiz.querySelector('.identidad p .etiqueta');
  const cuerpo = raiz.querySelector('.identidad tbody');
  const aviso = raiz.querySelector('.aviso-punteado');
  const fuentes = raiz.querySelector('.resumen');
  const boton = raiz.querySelector('[data-accion]');
  boton.removeAttribute('data-accion');

  const pintar = ({ asegurado, reclamante, poliza, listas, consultado }) => {
    datos.replaceChildren();
    const par = (t, v) => { const dt = document.createElement('dt'); dt.textContent = t; const dd = document.createElement('dd'); dd.textContent = v; datos.append(dt, dd); };
    par('Documento', asegurado ? `${asegurado.tipo_documento} ${asegurado.numero_documento}` : 'No registrado');
    par('Asegurado', asegurado?.nombre_completo ?? '—');
    par('Reclamante', reclamante ?? '—');
    par('Póliza', poliza ?? '—');
    sello.textContent = asegurado ? 'Asegurado registrado' : 'Sin registro';
    sello.className = `etiqueta etiqueta--${asegurado ? 'verde' : 'rojo'}`;

    cuerpo.replaceChildren();
    listas.forEach((l) => {
      const fila = cuerpo.insertRow();
      if (l.resultado !== 'Sin coincidencia') fila.classList.add('seleccionada');
      fila.insertCell().textContent = l.persona;
      fila.insertCell().textContent = 'Involucrado';
      fila.insertCell().textContent = l.lista;
      const c = fila.insertCell();
      const e = document.createElement('span'); e.className = `etiqueta etiqueta--${CLASE[l.resultado] ?? 'gris'}`; e.textContent = l.resultado; c.append(e);
    });
    const alertas = listas.filter((l) => l.resultado !== 'Sin coincidencia');
    aviso.textContent = alertas.length ? `${alertas[0].resultado} con ${alertas[0].persona} (${alertas[0].lista}). Revisar antes de continuar.` : 'Sin coincidencias en las listas consultadas.';
    fuentes.textContent = `Registro de asegurados · Listas UIF y OFAC. Última consulta: ${consultado.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}.`;
  };

  const cargar = (registrar) => identidadDe(ctx.params.caso, { registrar }).then(pintar);
  cargar(false).catch(() => toast('No se pudo consultar la identidad.', 'alerta'));
  boton.addEventListener('click', async () => {
    try { await cargar(true); toast('Consulta actualizada y registrada en la bitácora.', 'ok'); anunciar('Identidad y listas actualizadas.'); }
    catch { toast('No se pudo consultar. Inténtalo otra vez.', 'alerta'); }
  });
}
