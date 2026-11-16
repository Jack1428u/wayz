// Documentos del expediente (W-09): adjuntos reales (Storage), verificación de autenticidad y vista previa.
import { hayBaseDeDatos } from '../datos/supabase.js';
import { evaluarReclamo } from '../datos/agente-reglas.js';
import { documentosDe, datosReclamo, recargarReclamos } from '../datos/repositorio.js';
import { subirAdjunto, enlaceTemporal, EXTENSIONES } from '../datos/adjuntos.js';
import { toast, anunciar } from '../nucleo/avisos.js';
import { obtenerSesion } from '../nucleo/almacen.js';

const tamano = (b) => (b == null ? '' : b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const el = (tag, props = {}, ...hijos) => { const e = Object.assign(document.createElement(tag), props); e.append(...hijos); return e; };
const ESTADO = { Verificado: ['verde', 'Auténtico'], Sospechoso: ['rojo', 'Sospechoso'], 'Sin verificar': ['gris', 'Sin verificar'] };

export default function documentos(raiz, ctx) {
  if (!hayBaseDeDatos) return;
  const lista = raiz.querySelector('.lista-adjuntos');
  const titulo = raiz.querySelector('.docs h2');
  const visor = raiz.querySelector('.visor');
  const puedeSubir = ['analista', 'lider'].includes(obtenerSesion()?.rol);
  const boton = raiz.querySelector('[data-accion]');
  boton.removeAttribute('data-accion');
  boton.disabled = !puedeSubir;
  if (!puedeSubir) boton.title = 'Tu rol no puede subir adjuntos.';
  const entrada = el('input', { type: 'file', multiple: true, accept: EXTENSIONES, className: 'solo-lectores', ariaLabel: 'Elegir archivos para adjuntar' });
  boton.after(entrada);
  boton.addEventListener('click', () => entrada.click());

  // Con documentos reales se quitan los adornos del prototipo (buscador y barra de progreso de ejemplo):
  // mostrar datos falsos junto a datos reales confunde. En su lugar, un mensaje que dice qué hacer (heurística 6 y 10).
  visor.querySelector('.visor__buscar')?.remove();
  visor.querySelector('.progreso')?.remove();
  visor.querySelector('small')?.remove();
  const hoja = visor.querySelector('.visor__hoja');
  if (hoja) hoja.textContent = 'Selecciona un documento de la lista para ver el resultado de su verificación de autenticidad.';

  const mostrar = async (d) => {
    const url = d.ruta_storage ? await enlaceTemporal(d.ruta_storage) : null;
    const [color, texto] = ESTADO[d.autenticidad] ?? ESTADO['Sin verificar'];
    visor.replaceChildren(
      el('h2', { textContent: d.nombre }),
      el('p', {}, el('span', { className: `etiqueta etiqueta--${color}`, textContent: texto })),
      el('p', { textContent: d.autenticidad_detalle ?? 'Este documento aún no se ha verificado.' }),
      el('p', { className: 'resumen', textContent: d.hash_sha256 ? `Huella SHA-256: ${d.hash_sha256}` : '' }),
    );
    if (!url) return;
    if (d.nombre.match(/\.(png|jpe?g)$/i)) visor.append(el('img', { src: url, alt: `Vista previa de ${d.nombre}`, style: 'max-width:100%;border-radius:8px' }));
    else visor.append(el('a', { href: url, target: '_blank', rel: 'noopener', className: 'boton', textContent: 'Abrir documento (enlace temporal de 2 minutos)' }));
  };

  const pintar = (docs) => {
    lista.replaceChildren();
    titulo.textContent = `Adjuntos (${docs.filter((d) => d.estado === 'Entregado').length} de ${docs.length})`;
    if (!docs.length) { lista.append(el('li', { textContent: 'Este caso aún no tiene documentos.' })); return; }
    docs.forEach((d) => {
      const ext = (d.nombre.includes('.') ? d.nombre.split('.').pop() : 'doc').slice(0, 4).toUpperCase();
      const [color, texto] = ESTADO[d.autenticidad] ?? ESTADO['Sin verificar'];
      const li = el('li', { tabIndex: 0 },
        el('span', { className: `icono icono--${ext.toLowerCase()}`, textContent: ext }),
        el('div', {}, el('b', { textContent: d.nombre }), el('small', { textContent: d.estado === 'Faltante' ? 'Faltante: pendiente de entrega' : `${ext} · ${tamano(d.tamano_bytes)}` })),
      );
      if (d.estado === 'Faltante') li.append(el('span', { className: 'etiqueta etiqueta--rojo', textContent: 'Falta' }));
      else {
        li.append(el('span', { className: `etiqueta etiqueta--${color}`, textContent: texto }));
        const abrir = () => mostrar(d);
        li.addEventListener('click', abrir);
        li.addEventListener('keydown', (e) => { if (e.key === 'Enter') abrir(); });
      }
      lista.append(li);
    });
  };

  const recargar = () => documentosDe(ctx.params.caso).then(pintar).catch(() => toast('No se pudieron cargar los documentos.', 'alerta'));

  entrada.addEventListener('change', async () => {
    const reclamo = await datosReclamo(ctx.params.caso);
    if (!reclamo) return toast('No se encontró el reclamo.', 'alerta');
    for (const archivo of entrada.files) {
      try {
        anunciar(`Verificando ${archivo.name}…`);
        const r = await subirAdjunto({ codigo: ctx.params.caso, ...reclamo, archivo });
        toast(r.resultado === 'Verificado' ? `✔ ${archivo.name}: documento auténtico (sin alertas).` : `⚠ ${archivo.name}: ${r.hallazgos[0].texto}`, r.resultado === 'Verificado' ? 'ok' : 'alerta');
      } catch (err) {
        toast(`${archivo.name}: ${err.message}`, 'alerta');
      }
    }
    entrada.value = '';
    try { const ev = await evaluarReclamo(ctx.params.caso); await recargarReclamos(); toast(`Agente: caso reevaluado → ${ev.prioridad} (${ev.puntaje}/100).`, 'info'); } catch { /* la evaluación es opcional */ }
    recargar();
  });

  recargar();
}
