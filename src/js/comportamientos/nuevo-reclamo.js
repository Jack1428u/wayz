// Registrar reclamo: verificación de documento, adjuntos con progreso y guardado del caso nuevo.
import { validarFormulario, marcarError, limpiarError } from '../nucleo/formularios.js';
import { trabajo } from '../nucleo/almacen.js';
import { confirmar } from '../nucleo/dialogo.js';
import { toast } from '../nucleo/avisos.js';
import { hayBaseDeDatos } from '../datos/supabase.js';
import { crearReclamo, buscarAsegurado, datosReclamo, recargarReclamos as cargarReclamosYa } from '../datos/repositorio.js';
import { analizarArchivo, subirAdjunto } from '../datos/adjuntos.js';
import { evaluarReclamo } from '../datos/agente-reglas.js';

export default function nuevoReclamo(raiz, ctx) {
  const form = raiz.querySelector('#f-reclamo');
  const ok = raiz.querySelector('#verificado');
  const hoy = new Date().toISOString().slice(0, 10);
  form.fecha.max = hoy; // prevención de errores: no se acepta una fecha futura
  form.fecha.dataset.mensaje = 'Indica la fecha en que ocurrió el hecho (no puede ser futura).';

  // --- Verificación de identidad: se consulta el registro de asegurados de la base de datos ---
  raiz.querySelector('#verificar').addEventListener('click', async () => {
    const largo = { DNI: 8, RUC: 11, CE: 9 }[form.tipoDoc.value];
    const num = form.numero.value.trim();
    ok.hidden = true;
    if (!new RegExp(`^\\d{${largo}}$`).test(num)) {
      marcarError(form.numero, `Un ${form.tipoDoc.value} tiene ${largo} dígitos. Revisa el número e inténtalo otra vez.`);
      form.numero.focus();
      return;
    }
    limpiarError(form.numero);
    if (!hayBaseDeDatos) {
      if (!form.nombre.value) form.nombre.value = 'Carla Mendoza Rojas';
      ok.textContent = '✔ Identidad verificada (modo demostración, sin base de datos).';
      ok.hidden = false;
      return;
    }
    const a = await buscarAsegurado(form.tipoDoc.value, num);
    if (!a) {
      marcarError(form.numero, `El ${form.tipoDoc.value} ${num} no figura en el registro de asegurados. Revisa el número o registra al asegurado primero.`);
      form.numero.focus();
      return;
    }
    form.nombre.value = a.nombre_completo;
    if (a.correo && !form.correo.value) form.correo.value = a.correo;
    if (a.telefono && !form.telefono.value) form.telefono.value = a.telefono;
    ok.textContent = `✔ Identidad verificada contra el registro de asegurados: ${a.nombre_completo}.`;
    ok.hidden = false;
  });

  // --- Adjuntos: se analizan al elegirlos (huella, tipo real, duplicados) y se suben al guardar el reclamo ---
  const lista = raiz.querySelector('#lista-carga');
  const zona = raiz.querySelector('#zona');
  const pendientes = [];
  const agregar = (archivos) => [...archivos].forEach(async (f) => {
    const li = document.createElement('li');
    const nombre = document.createElement('span');
    nombre.textContent = `${f.name} · ${(f.size / 1048576).toFixed(1)} MB — verificando…`;
    li.append(nombre);
    lista.append(li);
    try {
      const r = await analizarArchivo(f, { fechaHecho: form.fecha.value || null });
      if (r.rechazado) { nombre.textContent = `✖ ${f.name}: ${r.hallazgos[0].texto}`; return; }
      pendientes.push(f);
      nombre.textContent = r.resultado === 'Verificado'
        ? `✔ ${f.name} · ${(f.size / 1048576).toFixed(1)} MB — sin alertas de autenticidad`
        : `⚠ ${f.name} — ${r.hallazgos.map((h) => h.texto).join(' ')}`;
    } catch { nombre.textContent = `✖ ${f.name}: no se pudo leer el archivo.`; }
  });
  raiz.querySelector('#archivos').addEventListener('change', (e) => agregar(e.target.files));
  zona.addEventListener('dragover', (e) => { e.preventDefault(); zona.classList.add('zona-carga--sobre'); });
  zona.addEventListener('dragleave', () => zona.classList.remove('zona-carga--sobre'));
  zona.addEventListener('drop', (e) => { e.preventDefault(); zona.classList.remove('zona-carga--sobre'); agregar(e.dataTransfer.files); });

  // --- Prevención de pérdida de datos (heurísticas 3 y 5: control del usuario y prevención de errores) ---
  // Si hay datos escritos y la persona intenta salir (enlace, menú o recargar), se le pregunta antes de descartarlos.
  let sucio = false;
  let guardando = false;
  form.addEventListener('input', () => { sucio = true; });
  const alRecargar = (e) => { if (sucio && !guardando) { e.preventDefault(); e.returnValue = ''; } };
  window.addEventListener('beforeunload', alRecargar);
  const protegerSalida = async (e) => {
    if (!document.contains(form)) return;
    const enlace = e.target.closest?.('a[href^="#/"]');
    if (!enlace || !sucio || guardando || enlace.getAttribute('href') === location.hash) return;
    e.preventDefault();
    e.stopPropagation();
    const salir = await confirmar({
      titulo: '¿Salir sin guardar?',
      mensaje: 'Escribiste datos en este reclamo. Si sales ahora, se perderán.',
      aceptar: 'Sí, salir',
      peligro: true,
    });
    if (salir) { sucio = false; location.hash = enlace.getAttribute('href'); }
  };
  document.addEventListener('click', protegerSalida, true);

  // --- Guardar ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (guardando) return; // evita registrar el mismo reclamo dos veces si se pulsa el botón de nuevo
    if (!validarFormulario(form)) return;
    // Visibilidad del estado del sistema (heurística 1): el botón muestra en qué paso va el guardado.
    const boton = form.querySelector('[type="submit"]');
    const paso = (texto) => { boton.textContent = texto; };
    const liberar = () => { guardando = false; boton.disabled = false; boton.removeAttribute('aria-busy'); boton.textContent = 'Guardar reclamo'; };
    guardando = true;
    boton.disabled = true;
    boton.setAttribute('aria-busy', 'true');
    paso('Guardando reclamo…');
    let id;
    if (hayBaseDeDatos) {
      try {
        id = await crearReclamo({
          poliza: form.poliza.value, reclamante: form.nombre.value.trim(), tipo: form.tipo.value,
          fechaHecho: form.fecha.value, monto: Number(form.monto.value), descripcion: form.descripcion.value.trim(),
        });
      } catch (err) {
        liberar();
        marcarError(form.poliza, err.message);
        form.poliza.focus();
        return;
      }
      const reclamo = await datosReclamo(id);
      // Los adjuntos se suben en paralelo (más rápido que uno por uno); cada fallo se informa por separado.
      let subidos = 0;
      if (pendientes.length) {
        paso(`Subiendo y verificando ${pendientes.length} ${pendientes.length === 1 ? 'adjunto' : 'adjuntos'}…`);
        const resultados = await Promise.allSettled(pendientes.map((archivo) => subirAdjunto({ codigo: id, ...reclamo, archivo })));
        resultados.forEach((r, i) => {
          if (r.status === 'fulfilled') subidos += 1;
          else toast(`${pendientes[i].name}: ${r.reason?.message ?? 'no se pudo subir'}`, 'alerta');
        });
      }
      if (subidos) toast(`${subidos} adjunto(s) guardados y verificados.`, 'ok');
      // El agente evalúa el reclamo apenas se registra (sugerencia: el analista decide).
      paso('El agente está evaluando el caso…');
      try {
        const ev = await evaluarReclamo(id);
        await cargarReclamosYa();
        toast(`Agente: ${ev.prioridad} (${ev.puntaje}/100). ${ev.motivos[0] ?? 'Sin señales de alerta.'}`, ev.prioridad === 'Baja' ? 'ok' : 'alerta');
      } catch { toast('El reclamo se guardó, pero el agente no pudo evaluarlo ahora.', 'alerta'); }
    } else {
      id = `RCL-${2060 + trabajo.casosNuevos.length}`;
      trabajo.casosNuevos.push({
        id, asegurado: form.nombre.value.trim(), reclamante: form.nombre.value.trim(), tipo: form.tipo.value, riesgo: 'Medio', urgencia: 'Media',
        plazo: 15, estado: 'Nuevo', poliza: form.poliza.value, monto: Number(form.monto.value), fecha: form.fecha.value,
      });
    }
    toast(`Reclamo ${id} registrado. Ya aparece en la bandeja.`, 'ok');
    sucio = false; // ya se guardó: salir de la pantalla no pierde nada
    ctx.ir('/reclamos');
  });

  // Limpieza al salir de la pantalla: quita los oyentes globales para que no queden activos en otras vistas.
  return () => {
    window.removeEventListener('beforeunload', alRecargar);
    document.removeEventListener('click', protegerSalida, true);
  };
}
