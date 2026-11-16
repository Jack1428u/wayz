// Estructura fija de la aplicación: cabecera + menú lateral + zona de contenido.
// Se dibuja una vez al iniciar sesión; después solo cambian el menú activo, las pestañas y la vista.

import logo from '../../assets/logo_con_letras.png';
import { SECCIONES, rutaDeSeccion } from '../config/roles.js';
import { pestanasVisibles, PESTANAS } from '../config/rutas.js';
import { cambiarPrefs, obtenerPrefs, cerrarSesion, trabajo } from '../nucleo/almacen.js';
import { NOTIFICACIONES } from '../datos/datos.js';
import { anunciar, toast } from '../nucleo/avisos.js';
import { salir } from '../datos/repositorio.js';

const sinLeer = () => NOTIFICACIONES.filter((n) => !n.leida).length;

export function montarEstructura(sesion) {
  const raiz = document.getElementById('app');
  const n = sinLeer();
  raiz.innerHTML = `
  <div class="app" id="estructura">
    <header class="cabecera">
      <button type="button" class="cabecera__menu" id="btn-menu" aria-expanded="false" aria-controls="lateral">
        <span aria-hidden="true">☰</span><span class="solo-lectores">Menú de secciones</span>
      </button>
      <a class="cabecera__marca" href="#/" aria-label="Wayz, ir al inicio"><img src="${logo}" alt="Wayz" width="106" height="30"></a>
      <form class="cabecera__buscar" role="search" id="form-buscar">
        <label class="solo-lectores" for="buscar">Buscar caso, asegurado o DNI/RUC</label>
        <input id="buscar" type="search" placeholder="Buscar caso, asegurado o DNI/RUC" autocomplete="off">
        <button type="submit" class="cabecera__lupa"><span aria-hidden="true">🔍</span><span class="solo-lectores">Buscar</span></button>
      </form>
      <button type="button" class="cabecera__sol" id="btn-sol" aria-pressed="false" title="Máximo contraste y bordes gruesos para leer con luz directa. No cambia el tamaño de la letra.">
        <span aria-hidden="true">☀</span> Modo sol: <span data-estado>desactivado</span>
      </button>
      <button type="button" class="cabecera__ayuda" data-dialog="ayuda" title="Ayuda de esta pantalla (tecla ?)">
        <span aria-hidden="true">?</span><span class="solo-lectores">Ayuda de esta pantalla</span>
      </button>
      <a class="cabecera__campana" href="#/notificaciones" aria-label="Notificaciones: ${n} sin leer">
        <span aria-hidden="true">🔔</span>${n ? `<span class="insignia" aria-hidden="true">${n}</span>` : ''}
      </a>
      <div class="menu-usuario">
        <button type="button" class="cabecera__usuario" id="btn-usuario" aria-expanded="false" aria-controls="menu-usuario">
          <span class="cabecera__nombre"></span> <span aria-hidden="true">▾</span>
        </button>
        <ul class="menu-usuario__lista" id="menu-usuario" hidden>
          <li><a href="#/configuracion/preferencias">Preferencias de lectura</a></li>
          <li><button type="button" data-dialog="soporte">Soporte técnico</button></li>
          <li><button type="button" id="btn-salir">Cerrar sesión</button></li>
        </ul>
      </div>
    </header>

    <nav class="lateral" id="lateral" aria-label="Secciones principales"></nav>
    <div class="velo" id="velo" hidden></div>

    <main class="contenido" id="contenido-principal" tabindex="-1">
      <nav class="pestanas" id="pestanas" aria-label="Subsecciones" hidden></nav>
      <div id="vista"></div>
    </main>
  </div>`;
  raiz.querySelector('.cabecera__nombre').textContent = `${sesion.nombre} · ${sesion.rolNombre}`;
  conectarEventos(raiz);
  return raiz.querySelector('#vista');
}

export function desmontarEstructura() {
  document.getElementById('app').replaceChildren();
}

export const hayEstructura = () => !!document.getElementById('estructura');

function conectarEventos(raiz) {
  const app = raiz.querySelector('#estructura');
  const btnMenu = raiz.querySelector('#btn-menu');
  const velo = raiz.querySelector('#velo');
  const alternarMenu = (abrir) => {
    app.classList.toggle('app--menu', abrir);
    btnMenu.setAttribute('aria-expanded', String(abrir));
    velo.hidden = !abrir;
    if (abrir) raiz.querySelector('#lateral a')?.focus(); else btnMenu.focus();
  };
  btnMenu.addEventListener('click', () => alternarMenu(btnMenu.getAttribute('aria-expanded') !== 'true'));
  velo.addEventListener('click', () => alternarMenu(false));
  raiz.querySelector('#lateral').addEventListener('click', (e) => e.target.closest('a') && app.classList.contains('app--menu') && alternarMenu(false));

  // Búsqueda: lleva a la bandeja con el texto buscado.
  raiz.querySelector('#form-buscar').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = raiz.querySelector('#buscar').value.trim();
    location.hash = `#/reclamos${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  });

  // Modo sol (inclusión: uso con luz directa).
  raiz.querySelector('#btn-sol').addEventListener('click', () => {
    const activo = !obtenerPrefs().sol;
    cambiarPrefs({ sol: activo });
    // Retroalimentación explícita (heurística 1): se dice qué cambió y qué NO cambió, y dónde ajustar el tamaño del texto.
    const mensaje = activo
      ? 'Modo sol activado: máximo contraste y bordes gruesos. El tamaño de la letra no cambia; puedes ajustarlo en Preferencias de lectura.'
      : 'Modo sol desactivado: volviste a la paleta que tenías elegida.';
    anunciar(mensaje);
    toast(mensaje, 'info');
  });

  // Menú de usuario (patrón de botón con lista desplegable).
  const bu = raiz.querySelector('#btn-usuario');
  const lista = raiz.querySelector('#menu-usuario');
  const cerrar = (devolverFoco) => {
    lista.hidden = true; bu.setAttribute('aria-expanded', 'false');
    if (devolverFoco) bu.focus();
  };
  bu.addEventListener('click', () => {
    const abrir = lista.hidden;
    lista.hidden = !abrir; bu.setAttribute('aria-expanded', String(abrir));
    if (abrir) lista.querySelector('a, button').focus();
  });
  lista.addEventListener('click', () => cerrar(false));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!lista.hidden) cerrar(true);
    else if (app.classList.contains('app--menu')) alternarMenu(false);
  });
  document.addEventListener('click', (e) => !e.target.closest('.menu-usuario') && !lista.hidden && cerrar(false));
  raiz.querySelector('#btn-salir').addEventListener('click', async () => { await salir(); cerrarSesion(); location.hash = '#/login'; });
}

/** Actualiza menú lateral y pestañas según la ruta actual. */
export function actualizarNavegacion(ruta, sesion) {
  const lateral = document.getElementById('lateral');
  const items = sesion.secciones.map((s) => {
    const activa = s === ruta.seccion;
    return `<a href="#${rutaDeSeccion(s, sesion.rol)}" ${activa ? 'class="activo" aria-current="page"' : ''}>
      <span aria-hidden="true">${SECCIONES[s].icono}</span> ${SECCIONES[s].nombre}</a>`;
  });
  lateral.innerHTML = `${items.join('')}<small>Se muestran solo las secciones permitidas para tu rol.</small>`;

  const pestanas = document.getElementById('pestanas');
  const lista = ruta.seccion && PESTANAS[ruta.seccion] ? pestanasVisibles(ruta.seccion, sesion.rol, trabajo.casoActual) : [];
  pestanas.hidden = lista.length < 2;
  pestanas.innerHTML = lista
    .map((p) => `<a href="#${p.ruta}" ${p.id === ruta.pestana ? 'class="activo" aria-current="page"' : ''}>${p.nombre}</a>`)
    .join('');

  const n = NOTIFICACIONES.filter((x) => !x.leida).length;
  const campana = document.querySelector('.cabecera__campana');
  if (campana) campana.setAttribute('aria-label', `Notificaciones: ${n} sin leer`);
  campana?.querySelector('.insignia')?.replaceChildren(String(n));
}
