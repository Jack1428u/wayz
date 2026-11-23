// Servicio de notificaciones por correo transaccional usando Resend.
// Solo para uso en Node.js (carpeta agente/). Nunca importar desde src/.

import { Resend } from 'resend';

const COLOR_PRIORIDAD = {
  Crítica: '#dc2626',
  Alta: '#d97706',
  Media: '#4b5563',
  Baja: '#16a34a',
};

function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function construirHtmlAnalisis(evaluacion) {
  const { id, puntaje, prioridad, resumen, motivos = [], accion, modo, modelo, fecha } = evaluacion;
  const color = COLOR_PRIORIDAD[prioridad] ?? '#4b5563';
  const listaMotivos = Array.isArray(motivos) && motivos.length
    ? `<ul style="margin: 8px 0 16px; padding-left: 20px; color: #374151;">
        ${motivos.map((m) => `<li style="margin-bottom: 4px;">${escaparHtml(m)}</li>`).join('')}
       </ul>`
    : '<p style="color: #6b7280; margin: 8px 0 16px;">Sin señales adicionales registradas.</p>';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Alerta de Análisis Wayz - ${escaparHtml(id)}</title>
</head>
<body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #111827;">
  <main style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
    <header style="background-color: #111827; color: #ffffff; padding: 20px 24px;">
      <h1 style="margin: 0; font-size: 18px; font-weight: 600;">Wayz · Alerta de Análisis de Riesgo</h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #d1d5db;">Reclamo ${escaparHtml(id)}</p>
    </header>
    <section style="padding: 24px;">
      <div style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px;">
        Prioridad ${escaparHtml(prioridad)} · ${escaparHtml(puntaje)}/100
      </div>

      <h2 style="font-size: 15px; margin: 0 0 8px; color: #111827;">Resumen del análisis</h2>
      <p style="margin: 0 0 16px; line-height: 1.5; color: #374151;">${escaparHtml(resumen)}</p>

      <h2 style="font-size: 15px; margin: 0 0 8px; color: #111827;">Motivos detectados</h2>
      ${listaMotivos}

      <div style="background-color: #f9fafb; border-left: 4px solid ${color}; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
        <strong style="display: block; font-size: 13px; color: #111827; margin-bottom: 4px;">Siguiente paso sugerido</strong>
        <p style="margin: 0; font-size: 14px; color: #374151;">${escaparHtml(accion)}</p>
      </div>
    </section>
    <footer style="background-color: #f9fafb; padding: 14px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
      Sugerencia automática generada por Agente Wayz (modo: ${escaparHtml(modo)}${modelo ? ` · ${escaparHtml(modelo)}` : ''}).
      ${fecha ? `Fecha: ${escaparHtml(fecha)}.` : ''}
    </footer>
  </main>
</body>
</html>`;
}

/**
 * Envía un correo transaccional con el resultado de la evaluación del agente.
 * Nunca lanza excepciones: ante un fallo registra el error y retorna { ok: false, error }.
 */
export async function enviarAlertaAnalisis(evaluacion, emailDestino) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_...') {
    const mensaje = 'RESEND_API_KEY no configurada; se omite el envío de correo.';
    console.warn(`   ! ${mensaje}`);
    return { ok: false, error: mensaje };
  }

  const remitente = process.env.EMAIL_FROM || 'Wayz Alertas <alertas@tudominio.com>';
  const destinatario = emailDestino || process.env.EMAIL_ANALISTA_DEFAULT || 'analista@wayz.demo';
  const idempotencyKey = `wayz-analisis-${evaluacion.id}-${evaluacion.fecha ?? 'sin-fecha'}`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send(
      {
        from: remitente,
        to: [destinatario],
        subject: `[Wayz] Alerta ${evaluacion.prioridad} (${evaluacion.puntaje}/100) - Reclamo ${evaluacion.id}`,
        html: construirHtmlAnalisis(evaluacion),
      },
      { idempotencyKey }
    );

    if (error) {
      console.error(`   ! Error de Resend al enviar alerta de ${evaluacion.id}:`, error.message ?? error);
      return { ok: false, error };
    }

    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    console.error(`   ! Excepción al enviar alerta de ${evaluacion.id}:`, err?.message ?? err);
    return { ok: false, error: err?.message ?? String(err) };
  }
}
