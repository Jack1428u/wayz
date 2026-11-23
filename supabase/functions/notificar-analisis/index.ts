// Supabase Edge Function: notificar-analisis
// Recibe la evaluación del Agente y el correo destino, y utiliza Resend para despachar el correo.
// Se ejecuta en Deno runtime en el entorno serverless de Supabase.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@6.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COLOR_PRIORIDAD: Record<string, string> = {
  Crítica: '#dc2626',
  Alta: '#d97706',
  Media: '#4b5563',
  Baja: '#16a34a',
};

function escaparHtml(texto: unknown): string {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function construirHtmlAnalisis(evaluacion: any): string {
  const { id, puntaje, prioridad, resumen, motivos = [], accion, modo, modelo, fecha } = evaluacion;
  const color = COLOR_PRIORIDAD[prioridad] ?? '#4b5563';
  const listaMotivos = Array.isArray(motivos) && motivos.length
    ? `<ul style="margin: 8px 0 16px; padding-left: 20px; color: #374151;">
        ${motivos.map((m: string) => `<li style="margin-bottom: 4px;">${escaparHtml(m)}</li>`).join('')}
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { evaluacion, emailDestino } = await req.json();

    if (!evaluacion || !evaluacion.id) {
      return new Response(JSON.stringify({ error: 'Faltan los datos de la evaluación' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY no configurada en Supabase Secrets' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const remitente = Deno.env.get('EMAIL_FROM') || 'Wayz Alertas <alertas@tudominio.com>';
    const destinatario = emailDestino || Deno.env.get('EMAIL_ANALISTA_DEFAULT') || 'analista@wayz.demo';
    const idempotencyKey = `wayz-analisis-${evaluacion.id}-${evaluacion.fecha ?? 'sin-fecha'}`;

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
      console.error('Error desde Resend:', error);
      return new Response(JSON.stringify({ error: error.message ?? error }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id ?? null, destinatario }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Excepción en Edge Function:', err);
    return new Response(JSON.stringify({ error: err?.message ?? 'Error interno del servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
