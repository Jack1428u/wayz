// Ayuda centrada en la tarea (heurística 10 de Nielsen: «ayuda y documentación»).
// Cada pantalla explica, en pocos pasos concretos, qué puede hacer la persona y qué pasará.
// Se muestra con el botón «?» de la cabecera o con la tecla «?».

export const AYUDA = {
  panel: {
    objetivo: 'Ver qué casos conviene revisar primero.',
    pasos: [
      'Lee el banner «Agente Wayz»: te dice cuántos casos son críticos y altos.',
      'En la tabla, la columna «Sugerido por el agente» ordena por prioridad (Crítica, Alta, Media, Baja).',
      'Haz clic en una fila para elegirla y abre su expediente con el enlace del caso.',
      'Recuerda: el agente solo sugiere. La decisión es tuya.',
    ],
  },
  bandeja: {
    objetivo: 'Encontrar un reclamo y abrirlo.',
    pasos: [
      'Escribe en «Buscar» o usa los filtros de riesgo y estado. El conteo se actualiza solo.',
      'Selecciona una fila para ver, a la derecha, el resumen y lo que dice el agente.',
      'Pulsa «Abrir expediente» para ver todo el detalle.',
      'Para crear un reclamo nuevo usa «Registrar reclamo» o la tecla N (analista y líder).',
    ],
  },
  'nuevo-reclamo': {
    objetivo: 'Registrar un reclamo y que el agente lo evalúe.',
    pasos: [
      'Escribe el documento y pulsa «Verificar»: se completan nombre, correo y teléfono desde el registro de asegurados.',
      'Completa tipo, fecha, monto y póliza (formato PL-123456). Los errores se explican junto a cada campo.',
      'Escribe la fecha del hecho ANTES de elegir archivos: así se compara con la fecha del archivo.',
      'Adjunta documentos: Wayz revisa su autenticidad y te avisa al instante.',
      'Pulsa «Guardar reclamo». Verás el avance (guardando, subiendo archivos, evaluando) y la prioridad que asignó el agente.',
      'Si sales con datos escritos, la aplicación te pregunta antes de descartarlos.',
    ],
  },
  'expediente-resumen': {
    objetivo: 'Entender un caso y decidir qué hacer.',
    pasos: [
      'Revisa «Evaluación del agente»: puntaje, motivos y siguiente paso sugerido.',
      'Recorre las pestañas: Documentos, Inconsistencias, Identidad y listas, Similares y redes, Bitácora.',
      '«Escalar» pide apoyo a un superior o colega. Queda registrado.',
      '«Decidir» aprueba, rechaza o deriva a Legal. Pide confirmación porque no se puede deshacer desde la pantalla.',
    ],
  },
  'expediente-documentos': {
    objetivo: 'Adjuntar y revisar los documentos del caso.',
    pasos: [
      'Pulsa «Adjuntar documentos» y elige uno o varios archivos (PDF, imagen, ZIP o TXT, hasta 20 MB).',
      'Cada archivo muestra «Auténtico» o «Sospechoso» con la razón.',
      'Haz clic en un documento para ver su huella SHA-256 y abrirlo (enlace temporal de 2 minutos).',
      'Al terminar, el agente vuelve a evaluar el caso por su cuenta.',
    ],
  },
  'expediente-inconsistencias': {
    objetivo: 'Revisar las alertas del caso.',
    pasos: [
      'Lee cada alerta y su gravedad.',
      'Compruébala con el documento o el dato que la causó.',
      'Márcala como revisada: se guarda en la base de datos.',
    ],
  },
  'expediente-identidad': {
    objetivo: 'Confirmar quién es el asegurado y si figura en listas de control.',
    pasos: [
      'Revisa los datos del asegurado y la póliza.',
      'La tabla cruza el nombre con listas de sancionados (datos ficticios en esta demo).',
      '«Consultar de nuevo» actualiza y deja constancia en la bitácora.',
    ],
  },
  'expediente-similares': {
    objetivo: 'Detectar posibles redes de fraude.',
    pasos: [
      'Mira los casos vinculados por datos en común (teléfono, dirección o asegurado).',
      'Abre el caso vinculado para compararlos.',
      'Si hay una red, usa «Escalar» para pedir apoyo.',
    ],
  },
  'expediente-bitacora': {
    objetivo: 'Ver quién hizo qué y cuándo.',
    pasos: [
      'Cada fila es una acción con fecha, hora y persona.',
      'No se puede editar ni borrar: sirve para sustentar decisiones.',
      'Líder, gerente, legal, auditor y administrador ven todo; el analista ve sus decisiones.',
    ],
  },
  'expediente-informe': {
    objetivo: 'Preparar el informe del caso.',
    pasos: [
      'Los «Hallazgos» salen del agente y puedes editarlos.',
      '«Guardar borrador» lo guarda en este navegador.',
      '«Exportar PDF» abre el diálogo de impresión: elige «Guardar como PDF».',
    ],
  },
  historial: {
    objetivo: 'Consultar las decisiones ya tomadas.',
    pasos: [
      'Escribe en el buscador para filtrar la tabla.',
      'Haz clic en el código de un caso para ver su detalle y bitácora.',
      '«Exportar» descarga un archivo CSV de ejemplo.',
    ],
  },
  notificaciones: {
    objetivo: 'Leer los avisos del sistema.',
    pasos: [
      'Las nuevas aparecen resaltadas con la etiqueta «Nueva».',
      '«Marcar todas como leídas» se guarda por usuario.',
    ],
  },
  'config-preferencias': {
    objetivo: 'Adaptar la lectura a tu situación (luz, vista, cansancio).',
    pasos: [
      'Elige una paleta: clara, cálida, oscura o alto contraste.',
      'Ajusta el contraste y el tamaño del texto con los deslizadores.',
      'El «Modo sol» del encabezado sube el contraste y engrosa los bordes, sin cambiar el tamaño de la letra.',
      'Tus preferencias se guardan en tu cuenta y vuelven cuando entras de nuevo.',
    ],
  },
};

export const AYUDA_GENERAL = {
  objetivo: 'Moverte por Wayz con seguridad.',
  pasos: [
    'El menú lateral muestra solo las secciones permitidas para tu rol.',
    'Las pestañas de arriba son las subsecciones; la pestaña activa está subrayada.',
    'El buscador de la cabecera encuentra casos, asegurados o documentos.',
    'Las pantallas marcadas como demostración muestran el diseño, pero no guardan datos.',
  ],
};

export const ATAJOS = [
  ['/', 'Ir al buscador'],
  ['?', 'Abrir esta ayuda'],
  ['N', 'Registrar un reclamo nuevo (analista y líder)'],
  ['Esc', 'Cerrar una ventana o el menú'],
  ['Tab', 'Avanzar entre controles (Mayús + Tab retrocede)'],
];
