# Wayz

Aplicación web para **detectar fraude en seguros** (aseguradoras medianas, agencias y MGAs). Es una sola aplicación responsive construida con **HTML5, CSS3 y JavaScript** (módulos ES), sin frameworks. Parte de los wireframes de Figma (46 pantallas web) y los unifica en un producto navegable de alto rendimiento.

> **Alcance:** Aplicación web conectada a una base de datos PostgreSQL (Supabase): inicio de sesión real, reclamos, decisiones, escalamientos, plazos y preferencias se guardan. Incorpora un subsistema de Agente de IA para evaluación de reclamos y un servicio de notificaciones transaccionales vía **Resend** (tanto en Node.js como desde la interfaz mediante Supabase Edge Functions). Sin claves en `.env.local` funciona en modo demostración con datos locales.

---

## Cómo ejecutarlo

Necesitas [Node.js](https://nodejs.org) (versión LTS).

```bash
npm install
npm run dev        # abre http://localhost:5173
npm run build      # genera la carpeta dist/ para publicar
```

### Cuentas de demostración

Contraseña: se la pide al equipo (no se publica aquí). Sin conexión a la base, la pantalla de ingreso muestra la clave de la demo local. Cada rol entra a su pantalla y solo ve sus secciones autorizadas (RBAC).

| Correo | Rol | Entra a |
|---|---|---|
| `analista@wayz.demo` | Analista | Panel del analista |
| `lider@wayz.demo` | Líder de analistas | Panel / carga del equipo |
| `gerente@wayz.demo` | Gerente | Centro de comando y Gerencia |
| `legal@wayz.demo` | Asesor legal | Área legal |
| `auditor@wayz.demo` | Auditor | Historial y auditoría |
| `tecnico@wayz.demo` | Analista técnico | Consulta avanzada (SQL) |
| `admin@wayz.demo` | Administrador | Usuarios, accesos y reglas |

Los botones de la pantalla de login rellenan las cuentas automáticamente.

---

## Estructura del proyecto

```
PROYECTO_WAYZ_HTML/
├── index.html                  única página; la app se dibuja dentro de <div id="app">
├── package.json                dependencias y comandos (dev, build, agente, preview)
├── package-lock.json           versiones exactas de dependencias
├── vite.config.js              configuración de Vite (rutas relativas, hosting estático)
├── README.md                   documentación técnica del proyecto
├── .gitignore                  excluye node_modules/, dist/, .env, etc.
├── .env.example                plantilla de variables (Gemini, Supabase, Resend)
├── base-de-datos/              SQL de la base de datos (esquema, seguridad y datos de ejemplo)
│   ├── 01-esquema.sql          17 tablas, índices, bitácora inmutable y vista_bandeja
│   ├── 02-seguridad.sql        políticas de seguridad por filas (RLS) y roles
│   └── 03-datos-ejemplo.sql    semillas de prueba y vínculos relacionales
├── agente/                     subsistema del agente de IA y notificaciones
│   ├── ejecutar.js             runner CLI del agente (modo batch o watcher --vigilar)
│   ├── agente.js               orquestador: Gemini con function calling o fallback de reglas
│   ├── herramientas.js         definición de las 5 herramientas de auditoría
│   ├── datos-agente.js         datos de expedientes simulados
│   ├── bandeja-entrada.json    cola de reclamos entrantes para el modo vigilar
│   ├── notificador-email.js    servicio de envío de alertas por correo con Resend
│   ├── subir-bd.js             sincronización de evaluaciones hacia Supabase
│   └── prueba.js               pruebas del agente con Gemini simulado
├── supabase/                   configuración de servicios serverless en Supabase
│   └── functions/
│       └── notificar-analisis/ Edge Function para enviar alertas desde la UI vía Resend
├── src/                        frontend SPA en Vanilla JS
│   ├── main.js                 arranque de la aplicación y restauración de sesión
│   ├── assets/                 recursos gráficos (logos)
│   ├── config/                 roles, permisos y rutas protegidas
│   ├── datos/                  repositorio de datos, cliente Supabase y resultados del agente
│   ├── nucleo/                 enrutador, almacén reactivo, accesibilidad, avisos e interacciones
│   ├── componentes/            componentes reutilizables (estructura, expediente, tarjeta agente)
│   ├── vistas/                 39 pantallas modulares (renderers HTML puros)
│   ├── comportamientos/        controladores de eventos e interacción por pantalla
│   ├── dialogos/               ventanas emergentes modales (<dialog>)
│   └── styles/                 hojas de estilo CSS modulares y tokens de diseño
└── referencia/                 wireframes HTML de referencia
```

---

## Agente de IA y Detección de Fraude

El **Agente Wayz** analiza reclamos de seguros de forma autónoma, calculando puntajes de riesgo objetivos y recomendando acciones claras al analista humano:

```
Reclamo nuevo → el Agente (Gemini o Reglas) decide:
   calcular_riesgo → (si el puntaje es alto) buscar_casos_similares · revisar_documentos · consultar_listas
   → registrar_evaluacion (prioridad + resumen + motivos + siguiente paso)
```

| Herramienta | Qué hace |
|---|---|
| `calcular_riesgo` | Puntaje 0 a 100 ponderado por factores objetivos (explicable). |
| `buscar_casos_similares` | Detecta redes organizadas: reclamos vinculados por teléfono, dirección o asegurado. |
| `revisar_documentos` | Identifica documentos entregados, faltantes obligatorios e inconsistencias. |
| `consultar_listas` | Cruce con listas restrictivas de prevención de lavado (UIF / OFAC). |
| `registrar_evaluacion` | Acción terminal obligatoria que consolida la recomendación para el analista. |

### Comandos del Agente

```bash
npm run agente            # Evalúa todos los reclamos y guarda src/datos/resultados-agente.json
npm run agente:vigilar    # Modo observador: vigila agente/bandeja-entrada.json y evalúa casos nuevos
npm run agente:subir      # Sube las evaluaciones locales a la tabla evaluaciones_agente en Supabase
npm run agente:prueba     # Ejecuta pruebas automáticas con Gemini simulado
```

<<<<<<< HEAD
---
=======
**Con Gemini:** crea tu clave en [Google AI Studio](https://aistudio.google.com), copia `.env.example` como `.env` y pega la clave en `GEMINI_API_KEY=`. El archivo `.env` está en `.gitignore`: **nunca se sube a GitHub**. Sin clave, o si Gemini falla o se agota la cuota, el agente sigue funcionando con reglas (las mismas herramientas, sin IA) y lo indica en pantalla.
>>>>>>> acf55c2fb7f7318ce047199ed4384e594ca3629c

## Notificaciones por Correo (Servicio Resend)

WAYZ cuenta con una integración dual para notificar los análisis de riesgo a través de **Resend**:

### 1. Envíos automáticos desde el Agente (`agente/ejecutar.js`)
- Al procesar cada reclamo mediante `npm run agente` o `npm run agente:vigilar`, se invoca `enviarAlertaAnalisis()` desde **agente/notificador-email.js**.
- Genera un correo en HTML semántico con la prioridad, puntaje, motivos e indicaciones sugeridas.
- Incorpora una pausa de 500 ms entre peticiones para respetar los límites de tasa (Rate Limits) de Resend.
- Aislado contra fallos: si la API de correo no responde o no hay conexión, el agente continúa su flujo de evaluación y persistencia sin interrupciones.

### 2. Envío a demanda desde la UI (Producción / Supabase Edge Functions)
- En la vista del expediente de cada reclamo, la tarjeta del agente incluye el botón:  
  **`✉ Enviar análisis a mi correo`**
- Al presionarlo, el frontend invoca de forma segura la Edge Function `notificar-analisis` alojada en Supabase, enviando el correo del analista en sesión (`obtenerSesion()?.correo`) como destinatario.
- **Seguridad:** Las credenciales privadas (`RESEND_API_KEY`) residen en los secretos de Supabase y **nunca se exponen en el navegador**.

#### Configuración de variables de entorno

En tu archivo `.env` (backend) y en los secretos de Supabase (`supabase secrets set`):
```env
# Claves de Gemini y Supabase
GEMINI_API_KEY=tu_clave_de_gemini
GEMINI_MODEL=gemini-2.5-flash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_anon

# Notificaciones por correo (Resend)
RESEND_API_KEY=re_tu_api_key_de_resend
EMAIL_FROM="Wayz Alertas <alertas@tudominio.com>"
EMAIL_ANALISTA_DEFAULT="analista@wayz.demo"
```

Para desplegar la Edge Function en Supabase:
```bash
npx supabase secrets set RESEND_API_KEY=re_... EMAIL_FROM="Wayz Alertas <alertas@tudominio.com>"
npx supabase functions deploy notificar-analisis
```

---

## Base de Datos (PostgreSQL en Supabase)

La carpeta `base-de-datos/` contiene los scripts DDL y DML para recrear el entorno completo:

| Archivo | Contenido y Función |
|---|---|
| `01-esquema.sql` | 17 tablas relacionales, índices, bitácora inmutable (trigger de bloqueo para UPDATE/DELETE) y vista consolidada `vista_bandeja`. |
| `02-seguridad.sql` | Políticas Row Level Security (RLS) por rol, esquema `private` para resolver el usuario actual y políticas de almacenamiento seguro en `storage.objects`. |
| `03-datos-ejemplo.sql` | Casos de prueba vinculados diseñados para disparar las alertas de fraude del agente (brechas temporales, pólizas recientes y redes cruzadas). |

---

## Principios de Diseño, HCI y Accesibilidad (WCAG 2.2)

- **Heurísticas de Nielsen:** Visibilidad del estado mediante avisos en vivo (`toast` y `aria-live`), prevención de errores con confirmaciones antes de dictámenes o firmas, navegación consistente y atajos de teclado (`/` para buscar, `Esc` para modales).
- **Modo Sol y Temas:** Botón dedicado en la cabecera para alto brillo en exteriores (negro sobre blanco, tipografía reforzada y mayor tamaño), sumado a temas Clara, Cálida, Oscura y Contraste.
- **Accesibilidad Total:** Controles 100% navegables por teclado, indicadores de foco de 3 px, etiquetas descriptivas (`<label>`, `aria-describedby`) y contraste superior a 4.5:1.
- **Diseño Responsive:** Layout fluido que adapta menús, tablas accesibles y paneles de trabajo desde pantallas móviles hasta monitores de escritorio.
