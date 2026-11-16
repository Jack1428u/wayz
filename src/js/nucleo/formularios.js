// Validación accesible de formularios (WCAG: el error se explica con texto, no solo con un borde rojo).
//  - <label> identifica el campo.
//  - aria-invalid expresa el estado de error.
//  - aria-describedby vincula el mensaje con el campo.
//  - El primer campo con error recibe el foco y se anuncia el resumen.

import { anunciar } from './avisos.js';

let contador = 0;
const idDe = (el) => el.id || (el.id = `campo-${++contador}`);

function nombreDe(el) {
  const etiqueta = el.closest('label')?.querySelector('span')?.textContent
    ?? (el.labels?.[0]?.textContent)
    ?? el.getAttribute('aria-label')
    ?? el.name ?? 'este campo';
  return etiqueta.trim().replace(/[:*]$/, '');
}

function mensajeDe(el) {
  const v = el.validity;
  if (el.dataset.mensaje && !v.valid) return el.dataset.mensaje;
  if (v.valueMissing) {
    return el.type === 'checkbox' ? `Marca «${nombreDe(el)}» para continuar.` : `Completa «${nombreDe(el)}».`;
  }
  if (v.typeMismatch && el.type === 'email') return 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
  if (v.patternMismatch) return el.title || 'El formato no es válido.';
  if (v.tooShort) return `Escribe al menos ${el.minLength} caracteres.`;
  if (v.rangeUnderflow) return `El valor mínimo es ${el.min}.`;
  return 'El valor no es válido.';
}

function zonaDeError(el) {
  const id = `${idDe(el)}-error`;
  let p = document.getElementById(id);
  if (!p) {
    p = document.createElement('p');
    p.id = id;
    p.className = 'error-campo';
    (el.closest('.campo, label') ?? el).after(p);
  }
  return p;
}

export function marcarError(el, texto) {
  const p = zonaDeError(el);
  p.textContent = `⚠ ${texto}`;
  el.setAttribute('aria-invalid', 'true');
  const ids = new Set((el.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
  ids.add(p.id);
  el.setAttribute('aria-describedby', [...ids].join(' '));
}

export function limpiarError(el) {
  document.getElementById(`${el.id}-error`)?.remove();
  el.removeAttribute('aria-invalid');
  const ids = (el.getAttribute('aria-describedby') ?? '').split(' ').filter((i) => i && i !== `${el.id}-error`);
  ids.length ? el.setAttribute('aria-describedby', ids.join(' ')) : el.removeAttribute('aria-describedby');
}

/** Valida todos los campos; devuelve true si no hay errores. */
export function validarFormulario(form) {
  const invalidos = [];
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.disabled || el.type === 'hidden' || el.type === 'file') return;
    if (el.checkValidity()) limpiarError(el);
    else { marcarError(el, mensajeDe(el)); invalidos.push(el); }
    // Una vez mostrado el error, se corrige en vivo mientras la persona escribe.
    if (!el.dataset.vigilado) {
      el.dataset.vigilado = '1';
      el.addEventListener('input', () => (el.checkValidity() ? limpiarError(el) : marcarError(el, mensajeDe(el))));
    }
  });
  if (invalidos.length) {
    invalidos[0].focus();
    anunciar(`Hay ${invalidos.length} ${invalidos.length === 1 ? 'campo' : 'campos'} por corregir. ${mensajeDe(invalidos[0])}`);
    return false;
  }
  return true;
}
