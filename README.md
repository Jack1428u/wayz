# Wayz

Aplicación web para **detectar fraude en seguros** (aseguradoras medianas, agencias y MGAs). Es una sola aplicación responsive hecha con **HTML5, CSS3 y JavaScript** (módulos ES), sin frameworks. Parte de los wireframes de Figma (46 pantallas web) y los unifica en un producto navegable.

> **Alcance:** aplicación web conectada a una base de datos PostgreSQL (Supabase): inicio de sesión real, reclamos, decisiones, escalamientos, plazos y preferencias se guardan. Algunas acciones (firmar, exportar PDF…) siguen siendo simulaciones. Sin claves en `.env.local` funciona en modo demostración con datos locales.

## Cómo ejecutarlo

Necesitas [Node.js](https://nodejs.org) (versión LTS).

```bash
npm install
npm run dev        # abre http://localhost:5500
npm run build      # genera la carpeta dist/ para publicar
```

### Cuentas de demostración

Contraseña: se la pide al equipo (no se publica aquí). Sin conexión a la base, la pantalla de ingreso muestra la clave de la demo local. Cada rol entra a su pantalla y solo ve sus secciones.

| Correo | Rol | Entra a |
|---|---|---|
| analista@wayz.demo | Analista | Panel del analista |
| lider@wayz.demo | Líder de analistas | Panel / carga del equipo |
| gerente@wayz.demo | Gerente | Centro de comando y Gerencia |
| legal@wayz.demo | Asesor legal | Área legal |
| auditor@wayz.demo | Auditor | Historial y auditoría |
| tecnico@wayz.demo | Analista técnico | Consulta avanzada (SQL) |
| admin@wayz.demo | Administrador | Usuarios, accesos y reglas |

Los botones de la pantalla de login rellenan las cuentas automáticamente.

## Estructura del proyecto

```
PROYECTO_WAYZ_HTML/
├── index.html                  única página; la app se dibuja dentro de <div id="app">
├── package.json                dependencias y comandos (dev, build, preview)
├── package-lock.json           versiones exactas de las dependencias (se sube a GitHub)
├── vite.config.js              configuración de Vite (rutas relativas, sirve en cualquier hosting estático)
├── README.md
├── .gitignore                  excluye node_modules/, dist/, .claude/ y .env (la clave)
├── .env.example                plantilla para poner la clave de Gemini (se copia como .env)
├── base-de-datos/              SQL de la base de datos (esquema, seguridad y datos de ejemplo)
├── agente/                     agente de IA autónomo (se ejecuta en la terminal, ver más abajo)
│   ├── ejecutar.js             arranca el agente (todos los casos o modo vigilar)
│   ├── agente.js               ciclo del agente: Gemini decide qué herramientas usar
│   ├── herramientas.js         las 5 herramientas y su descripción para Gemini
│   ├── datos-agente.js         datos de ejemplo que consultan las herramientas
│   ├── bandeja-entrada.json    reclamos «nuevos» que el agente detecta solo en modo vigilar
│   └── prueba.js               pruebas con un Gemini simulado (no usa internet ni clave)
├── src/
│   ├── main.js                 arranque de la aplicación
│   ├── assets/                 logos (logo_con_letras.png, logo_sin_letras.png)
│   ├── config/
│   │   ├── roles.js            roles, permisos y cuentas de demostración
│   │   └── rutas.js            mapa del sitio, pestañas y permisos por ruta
│   ├── datos/
│   │   ├── datos.js            casos y notificaciones de ejemplo (reemplazable por una API)
│   │   ├── agente.js           lee las sugerencias del agente
│   │   └── resultados-agente.json   evaluaciones que dejó el agente (lo genera npm run agente)
│   ├── nucleo/                 lo que sirve a toda la app
│   │   ├── app.js              enrutador: lee #/ruta, comprueba permisos y dibuja la vista
│   │   ├── almacen.js          estado: sesión y preferencias
│   │   ├── dialogo.js          ventanas <dialog> y confirmaciones
│   │   ├── formularios.js      validación accesible de formularios
│   │   ├── accesibilidad.js    mejoras automáticas (etiquetas, tablas ordenables…)
│   │   ├── interacciones.js    botones y formularios mediante atributos data-*
│   │   ├── avisos.js           avisos en pantalla y para lectores de pantalla
│   │   ├── preferencias.js     aplica tema, tamaño de texto y modo sol
│   │   ├── sonido.js           aviso sonoro de alertas críticas
│   │   └── dom.js              utilidades del DOM
│   ├── componentes/
│   │   ├── estructura.js       cabecera, menú lateral y pestañas
│   │   ├── expediente.js       cabecera común de las pantallas del expediente
│   │   └── agente.js           tarjeta e insignia «Evaluación del agente»
│   ├── vistas/                 39 pantallas, una por archivo (solo HTML)
│   ├── comportamientos/        21 archivos con la lógica de las vistas que la necesitan (solo JavaScript)
│   ├── dialogos/               8 ventanas emergentes: recuperar, alerta, asistente,
│   │                           decisión, escalar, plazo, firma y soporte
│   └── styles/
│       ├── index.css           orden de carga de los estilos
│       ├── tokens.css          colores, sombras y medidas con nombre
│       ├── temas.css           temas: clara, cálida, oscura, alto contraste y modo sol
│       ├── base.css            reinicio, tipografía, foco visible, avisos
│       ├── layout.css          cabecera, menú y zona de contenido (responsive)
│       ├── botones.css · componentes.css · compartido.css · dialogos.css · agente.css
│       └── vistas/             CSS propio de cada vista (con alcance .v-nombre)
└── referencia/
    └── wireframes-html/        las 46 pantallas sueltas anteriores (solo consulta; se puede borrar)
```

Regla de oro: **vista = HTML, comportamiento = JS, estilos = CSS**, cada uno en su archivo. Lo repetido (cabecera, menú, pestañas, cabecera del expediente, botones, tablas) está escrito una sola vez.

## Agente de IA autónomo

El **Agente Wayz** revisa los reclamos nuevos sin que nadie se lo pida y deja a cada uno priorizado y explicado para el analista. Es un agente porque tiene un objetivo, **decide solo** qué herramientas usar y en qué orden, y **actúa** (registra su evaluación). Un humano toma siempre la decisión final: el agente nunca aprueba ni rechaza.

```
Reclamo nuevo → el agente (Gemini) decide:
   calcular_riesgo → (si el puntaje es alto) buscar_casos_similares · revisar_documentos · consultar_listas
   → registrar_evaluacion (prioridad + resumen + motivos + siguiente paso)
```

| Herramienta | Qué hace |
|---|---|
| `calcular_riesgo` | Puntaje 0 a 100, con cada factor que suma puntos (explicable) |
| `buscar_casos_similares` | Detecta redes: casos con el mismo teléfono, dirección o asegurado |
| `revisar_documentos` | Documentos entregados, faltantes e inconsistencias |
| `consultar_listas` | Coincidencias en listas de sancionados |
| `registrar_evaluacion` | Acción final: guarda el resultado |

**Cómo usarlo** (en la terminal, dentro de la carpeta del proyecto):

```bash
npm run agente            # evalúa todos los reclamos y guarda src/datos/resultados-agente.json
npm run agente:vigilar    # queda trabajando solo: evalúa cada reclamo nuevo que aparezca en agente/bandeja-entrada.json
npm run agente:prueba     # 6 pruebas automáticas con un Gemini simulado
```

**Con Gemini (gratis):** crea tu clave en [Google AI Studio](https://aistudio.google.com), copia `.env.example` como `.env` y pega la clave en `GEMINI_API_KEY=`. El archivo `.env` está en `.gitignore`: **nunca se sube a GitHub**. Sin clave, o si Gemini falla o se agota la cuota, el agente sigue funcionando con reglas (las mismas herramientas, sin IA) y lo indica en pantalla.

**Dónde se ve en la aplicación:** columna «Sugerido por el agente» y resumen en el panel del analista, vista previa de la bandeja y tarjeta «Evaluación del agente» en el expediente. Cada evaluación dice qué herramientas usó y si el cerebro fue Gemini o las reglas.

**Seguridad y privacidad:** el puntaje siempre es el de la herramienta (el modelo explica, no inventa cifras); la clave nunca está en el código del navegador; no uses datos reales de asegurados con la capa gratuita de Gemini, porque Google puede usarlos para mejorar sus productos.

## Agente dentro de la app

Al registrar un reclamo (o subir adjuntos) la app ejecuta el agente en **modo reglas** (`src/datos/agente-reglas.js`): calcula el puntaje con los datos reales de la base, guarda la evaluación y prioriza el caso. Con `npm run agente` (y la clave de Gemini en `.env`) la evaluación se enriquece con IA; `npm run agente:subir` la guarda en la base.

## Base de datos (PostgreSQL en Supabase)

La carpeta `base-de-datos/` guarda el SQL para recrear la base desde cero, en este orden:

| Archivo | Qué hace |
|---|---|
| `01-esquema.sql` | 17 tablas, índices, la bitácora de solo agregar (un trigger bloquea editar o borrar) y la vista `vista_bandeja` |
| `02-seguridad.sql` | Seguridad por filas (RLS): sin cuenta no se ve nada y cada rol solo accede a lo suyo |
| `03-datos-ejemplo.sql` | Los mismos casos, usuarios y evaluaciones del agente que usa la aplicación (datos ficticios) |

Las contraseñas **no** se guardan en las tablas: las gestiona Supabase Auth. Al crear una cuenta en Authentication con el mismo correo de un usuario (por ejemplo `analista@wayz.demo`), el perfil se enlaza solo.

> **Conexión:** copia `.env.example` como `.env.local` y pega la URL y la clave pública (publishable) de Supabase. Las cuentas de demostración son reales en Supabase Auth (la contraseña no se publica; pídesela al equipo). `npm run agente:subir` guarda en la base las evaluaciones del agente (entra con la cuenta del rol técnico). Las claves **no** se suben a GitHub (`.gitignore`); cambia las contraseñas demo si publicas el proyecto.

## Cómo se aplican los principios del curso

**Diseño de interacción y heurísticas de Nielsen**

| Heurística | Dónde se ve |
|---|---|
| 1. Visibilidad del estado | Avisos tras cada acción, «Actualizado hace N s», conteo de resultados, barras de progreso |
| 3. Control y libertad | Cancelar en cada ventana, Esc cierra, cerrar sesión, «Quitar filtros» |
| 4. Consistencia | Mismo botón, tabla, etiqueta y ventana en toda la app |
| 5. Prevención de errores | Confirmación antes de decidir, firmar o reasignar; fecha futura bloqueada; consultas solo SELECT |
| 6. Reconocer antes que recordar | Menú y pestañas siempre visibles; migas de pan; cuentas demo a un clic |
| 7. Eficiencia | Atajo `/` para buscar; tablas ordenables; búsqueda global |
| 9. Recuperación de errores | Mensajes que dicen qué corregir, con ejemplo (`nombre@empresa.com`) |
| 10. Ayuda | Soporte técnico en el menú de usuario y en el login |

**Arquitectura de información:** una sola estructura para web y móvil (menú por secciones → pestañas → pantallas); en móvil el menú pasa a un panel con el botón ☰. Cada rol ve solo sus secciones (HU-027).

**Diseño inclusivo y accesibilidad (WCAG 2.2)**

- **Uso al sol:** botón **«Modo sol»** en la cabecera: negro sobre blanco, bordes gruesos, sin sombras ni grises claros, texto más grueso y 15 % más grande. Más temas en *Preferencias de lectura*: Clara, Cálida, Oscura y Alto contraste; tamaño de texto y contraste ajustables. Se recuerdan en el navegador y se respeta la preferencia del sistema (modo oscuro / más contraste).
- **Perceptible:** contraste mínimo 4,5:1 en texto y 3:1 en bordes de controles; el color nunca es la única señal (iconos ⚠ ✔, texto en etiquetas y errores); texto en `rem` que se amplía sin romperse.
- **Operable:** todo se usa con teclado; foco visible de 3 px; enlace «Saltar al contenido»; objetivos táctiles de 44 px; el foco pasa al título al cambiar de pantalla; ventanas con `<dialog>` (atrapan el foco y se cierran con Esc).
- **Comprensible:** `<label>` en cada campo, `aria-invalid` y `aria-describedby` en errores, mensajes en español claro.
- **Robusto:** HTML semántico (`header`, `nav`, `main`, `table` con `th scope`), regiones `aria-live` para anunciar cambios, interruptores con `role="switch"`.
- **Preferencias del usuario:** `prefers-reduced-motion` desactiva animaciones.

**Responsive:** diseño de móvil a escritorio con `grid`, `flex` y `@media`; las tablas se desplazan dentro de una región accesible; no hay desplazamiento horizontal de página.

## Publicación

Todavía no está definido dónde se publicará. `npm run build` genera la carpeta `dist/`, que funciona en cualquier hosting estático porque usa rutas relativas y rutas con `#`. Después de publicar, repite el recorrido completo en la dirección pública (login → panel → expediente → decisión).

## Verificación realizada

- Las 39 pantallas y las 8 ventanas cargan sin errores de JavaScript con los 7 roles; los permisos redirigen con un aviso.
- Auditoría automática: controles con nombre, un solo `h1`, sin ids repetidos, sin saltos de encabezados.
- Pruebas automáticas de los flujos principales (login correcto e incorrecto, filtros, búsqueda, decisión con confirmación, registro de reclamo, modo sol, temas, menú móvil).
- **Pendiente recomendado:** recorrer la app solo con teclado, pasar Lighthouse y WAVE sobre la versión publicada y probar con un lector de pantalla real (NVDA / VoiceOver). Una auditoría automática no certifica accesibilidad.

## Limitaciones conocidas

- Los datos y las cuentas son de demostración (ficticios) aunque viven en una base real.
- Algunas pantallas del expediente (identidad, redes, informe) muestran el mismo contenido de ejemplo para cualquier caso.
- Las versiones móviles M-01…M-42 de Figma no se compararon una por una: la app es responsive, pero no es una copia píxel a píxel de esos wireframes.
