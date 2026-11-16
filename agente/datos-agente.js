// Información adicional de cada reclamo que el agente puede consultar con sus herramientas.
// Son datos de ejemplo (no personas reales). En un sistema real saldrían de la base de datos y de servicios externos.

export const EXPEDIENTES = {
  'RCL-2041': {
    diasDesdeInicioPoliza: 41, valorAsegurado: 15000, reclamosPrevios: 1,
    documentos: { entregados: ['Informe del siniestro', 'Fotos del vehículo'], faltantes: ['Informe de peritaje'] },
    inconsistencias: ['La fecha del hecho es posterior a la denuncia', 'Monto reclamado mayor al valor asegurado', 'Facturas con importes repetidos'],
    listas: [{ persona: 'Beneficiario 2', lista: 'UIF · OFAC', tipo: 'posible' }],
    vinculos: [{ caso: 'RCL-1987', motivo: 'mismo teléfono y dirección (92 % de similitud, rechazado)' }],
  },
  'RCL-2038': {
    diasDesdeInicioPoliza: 95, valorAsegurado: 12000, reclamosPrevios: 2,
    documentos: { entregados: ['Historia clínica', 'Informe médico'], faltantes: [] },
    inconsistencias: ['Dirección distinta en dos documentos'],
    listas: [],
    vinculos: [
      { caso: 'RCL-1855', motivo: 'mismo teléfono' }, { caso: 'RCL-1904', motivo: 'misma dirección' },
      { caso: 'RCL-1790', motivo: 'mismo asegurado en común' },
    ],
  },
  'RCL-2052': {
    diasDesdeInicioPoliza: 380, valorAsegurado: 30000, reclamosPrevios: 0,
    documentos: { entregados: ['Fotos del daño', 'Proforma de reparación'], faltantes: ['Denuncia policial'] },
    inconsistencias: [], listas: [], vinculos: [],
  },
  'RCL-2047': {
    diasDesdeInicioPoliza: 28, valorAsegurado: 50000, reclamosPrevios: 0,
    documentos: { entregados: ['Acta de defunción'], faltantes: ['Historia clínica', 'Informe del beneficiario'] },
    inconsistencias: ['Póliza contratada pocas semanas antes del siniestro'],
    listas: [], vinculos: [],
  },
  'RCL-2033': {
    diasDesdeInicioPoliza: 700, valorAsegurado: 9000, reclamosPrevios: 0,
    documentos: { entregados: ['Informe del siniestro', 'Fotos del vehículo', 'Peritaje'], faltantes: [] },
    inconsistencias: [], listas: [], vinculos: [],
  },
  'RCL-2029': {
    diasDesdeInicioPoliza: 540, valorAsegurado: 6000, reclamosPrevios: 0,
    documentos: { entregados: ['Receta médica', 'Facturas'], faltantes: [] },
    inconsistencias: [], listas: [], vinculos: [],
  },
  'RCL-2025': {
    diasDesdeInicioPoliza: 820, valorAsegurado: 20000, reclamosPrevios: 0,
    documentos: { entregados: ['Fotos del daño', 'Proforma'], faltantes: [] },
    inconsistencias: [], listas: [], vinculos: [],
  },
};
