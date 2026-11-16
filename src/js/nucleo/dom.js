// Utilidades pequeñas para trabajar con el DOM de forma segura.

/** Escapa texto escrito por el usuario antes de insertarlo como HTML (evita inyección de código, XSS). */
export function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const $ = (selector, raiz = document) => raiz.querySelector(selector);
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

/** Devuelve una función que se ejecuta solo cuando pasan `ms` sin nuevas llamadas (útil al escribir en un buscador). */
export function retrasar(fn, ms = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
