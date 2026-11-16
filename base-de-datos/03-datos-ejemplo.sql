-- Datos de ejemplo (no son personas reales). No se usan ids fijos: todo se enlaza por código o correo.

insert into public.roles (codigo, nombre) values
  ('analista','Analista'), ('lider','Líder de analistas'), ('gerente','Gerente'), ('legal','Asesor legal'),
  ('auditor','Auditor'), ('tecnico','Analista técnico'), ('admin','Administrador');

insert into public.usuarios (nombre, correo, rol_id)
select v.nombre, v.correo, r.id
from (values
  ('Ana Torres','analista@wayz.demo','analista'), ('Luis Quispe','lider@wayz.demo','lider'),
  ('Gabriela Ríos','gerente@wayz.demo','gerente'), ('Mateo Salas','legal@wayz.demo','legal'),
  ('Aurora Vega','auditor@wayz.demo','auditor'), ('Tomás Rivera','tecnico@wayz.demo','tecnico'),
  ('Adriana Cruz','admin@wayz.demo','admin')
) as v(nombre, correo, rol)
join public.roles r on r.codigo = v.rol;

insert into public.preferencias_usuario (usuario_id) select id from public.usuarios;

-- Asegurados (7 del panel + 4 de reclamos históricos)
insert into public.asegurados (tipo_documento, numero_documento, nombre_completo, correo, telefono, direccion) values
  ('DNI','70000001','Asegurado A','asegurado.a@ejemplo.com','987000001','Av. Los Olivos 123, Lima'),
  ('DNI','70000002','Asegurado B','asegurado.b@ejemplo.com','987000002','Jr. Las Flores 456, Lima'),
  ('DNI','70000003','Asegurado C','asegurado.c@ejemplo.com','987000003','Calle Sol 789, Arequipa'),
  ('DNI','70000004','Asegurado D','asegurado.d@ejemplo.com','987000004','Av. Grau 321, Piura'),
  ('DNI','70000005','Asegurado E','asegurado.e@ejemplo.com','987000005','Psje. Luna 654, Cusco'),
  ('DNI','70000006','Asegurado F','asegurado.f@ejemplo.com','987000006','Av. Brasil 987, Lima'),
  ('DNI','70000007','Asegurado G','asegurado.g@ejemplo.com','987000007','Jr. Unión 147, Trujillo'),
  ('DNI','70000011','Asegurado H1','asegurado.h1@ejemplo.com','987000001','Av. Los Olivos 123, Lima'),
  ('DNI','70000012','Asegurado H2','asegurado.h2@ejemplo.com','987000002','Jr. Las Flores 456, Lima'),
  ('DNI','70000013','Asegurado H3','asegurado.h3@ejemplo.com','987000011','Jr. Las Flores 456, Lima'),
  ('DNI','70000014','Asegurado H4','asegurado.h4@ejemplo.com','987000012','Av. Arequipa 852, Lima');

-- Pólizas (la fecha de inicio refleja cuántos días pasaron hasta el siniestro)
insert into public.polizas (numero, asegurado_id, ramo, fecha_inicio, fecha_fin, valor_asegurado)
select v.numero, a.id, v.ramo, v.inicio, v.inicio + 365, v.valor
from (values
  ('PL-018741','70000001','Vehicular', date '2026-09-12' - 41, 15000),
  ('PL-017220','70000002','Salud',     date '2026-09-10' - 95, 12000),
  ('PL-019903','70000003','Hogar',     date '2026-09-14' - 380, 30000),
  ('PL-016118','70000004','Vida',      date '2026-09-08' - 28, 50000),
  ('PL-015477','70000005','Vehicular', date '2026-09-02' - 700, 9000),
  ('PL-014002','70000006','Salud',     date '2026-08-30' - 540, 6000),
  ('PL-013559','70000007','Hogar',     date '2026-08-27' - 820, 20000),
  ('PL-010011','70000011','Vehicular', date '2026-03-10' - 200, 14000),
  ('PL-010012','70000012','Salud',     date '2026-02-14' - 300, 11000),
  ('PL-010013','70000013','Salud',     date '2026-01-20' - 250, 10000),
  ('PL-010014','70000014','Hogar',     date '2025-12-05' - 400, 25000)
) as v(numero, doc, ramo, inicio, valor)
join public.asegurados a on a.numero_documento = v.doc;

-- Reclamos del analista (plazo_vence se calcula a partir de hoy)
insert into public.reclamos (codigo, poliza_id, reclamante_nombre, reclamante_correo, reclamante_telefono, tipo, fecha_hecho, fecha_denuncia,
                             monto_estimado, descripcion, estado, riesgo, urgencia, plazo_vence, analista_id)
select v.codigo, p.id, v.reclamante, v.correo, v.tel, v.tipo, v.fecha, v.denuncia, v.monto, v.descr, v.estado, v.riesgo, v.urgencia,
       case when v.plazo is null then null else current_date + v.plazo end, u.id
from (values
  ('RCL-2041','PL-018741','Carla Mendoza','carla.mendoza@ejemplo.com','987100001','Vehicular', date '2026-09-12', date '2026-09-10', 18500, 'Choque en la avenida principal por la noche.', 'En revisión','Alto','Alta', 2),
  ('RCL-2038','PL-017220','Jorge Palacios','jorge.palacios@ejemplo.com','987100002','Salud',     date '2026-09-10', date '2026-09-11',  9400, 'Hospitalización por emergencia.', 'Nuevo','Alto','Alta', 3),
  ('RCL-2052','PL-019903','Lucía Fernández','lucia.fernandez@ejemplo.com','987100003','Hogar',   date '2026-09-14', date '2026-09-14',  6200, 'Daños por filtración de agua.', 'Nuevo','Medio','Media', 6),
  ('RCL-2047','PL-016118','Pedro Alarcón','pedro.alarcon@ejemplo.com','987100004','Vida',       date '2026-09-08', date '2026-09-09', 52000, 'Fallecimiento del asegurado.', 'En revisión','Medio','Media', 7),
  ('RCL-2033','PL-015477','Rosa Chávez','rosa.chavez@ejemplo.com','987100005','Vehicular',      date '2026-09-02', date '2026-09-02',  3100, 'Rotura de luna delantera.', 'Pendiente','Bajo','Baja', 10),
  ('RCL-2029','PL-014002','Iván Huamán','ivan.huaman@ejemplo.com','987100006','Salud',          date '2026-08-30', date '2026-08-31',  2200, 'Consulta y medicinas.', 'Pendiente','Bajo','Baja', 12),
  ('RCL-2025','PL-013559','Marta Soto','marta.soto@ejemplo.com','987100007','Hogar',            date '2026-08-27', date '2026-08-27',  1800, 'Daño en la puerta principal.', 'Pendiente','Bajo','Baja', 14)
) as v(codigo, poliza, reclamante, correo, tel, tipo, fecha, denuncia, monto, descr, estado, riesgo, urgencia, plazo)
join public.polizas p on p.numero = v.poliza
cross join (select id from public.usuarios where correo = 'analista@wayz.demo') u;

-- Reclamos históricos (ya decididos): sirven para detectar vínculos y redes
insert into public.reclamos (codigo, poliza_id, reclamante_nombre, tipo, fecha_hecho, monto_estimado, descripcion, estado, riesgo, urgencia)
select v.codigo, p.id, v.reclamante, v.tipo, v.fecha, v.monto, v.descr, 'Decidido', v.riesgo, 'Baja'
from (values
  ('RCL-1987','PL-010011','Reclamante H1','Vehicular', date '2026-03-10', 16000, 'Choque con daños totales.', 'Alto'),
  ('RCL-1904','PL-010012','Reclamante H2','Salud',     date '2026-02-14',  8000, 'Cirugía programada.', 'Medio'),
  ('RCL-1855','PL-010013','Reclamante H3','Salud',     date '2026-01-20',  7500, 'Hospitalización.', 'Alto'),
  ('RCL-1790','PL-010014','Reclamante H4','Hogar',     date '2025-12-05', 12000, 'Incendio parcial.', 'Medio')
) as v(codigo, poliza, reclamante, tipo, fecha, monto, descr, riesgo)
join public.polizas p on p.numero = v.poliza;

-- Documentos
insert into public.documentos (reclamo_id, nombre, estado, tamano_bytes)
select r.id, v.nombre, v.estado, v.tam
from (values
  ('RCL-2041','Informe del siniestro','Entregado', 2000000), ('RCL-2041','Fotos del vehículo','Entregado', 48000000), ('RCL-2041','Informe de peritaje','Faltante', null),
  ('RCL-2038','Historia clínica','Entregado', 5000000), ('RCL-2038','Informe médico','Entregado', 1500000),
  ('RCL-2052','Fotos del daño','Entregado', 6000000), ('RCL-2052','Proforma de reparación','Entregado', 800000), ('RCL-2052','Denuncia policial','Faltante', null),
  ('RCL-2047','Acta de defunción','Entregado', 900000), ('RCL-2047','Historia clínica','Faltante', null), ('RCL-2047','Informe del beneficiario','Faltante', null),
  ('RCL-2033','Informe del siniestro','Entregado', 1800000), ('RCL-2033','Fotos del vehículo','Entregado', 22000000), ('RCL-2033','Peritaje','Entregado', 3000000)
) as v(codigo, nombre, estado, tam)
join public.reclamos r on r.codigo = v.codigo;

-- Inconsistencias
insert into public.inconsistencias (reclamo_id, descripcion, gravedad)
select r.id, v.descr, v.gravedad
from (values
  ('RCL-2041','La fecha del hecho es posterior a la denuncia','Alta'),
  ('RCL-2041','Monto reclamado mayor al valor asegurado','Alta'),
  ('RCL-2041','Facturas con importes repetidos','Media'),
  ('RCL-2041','Dirección distinta en dos documentos','Baja'),
  ('RCL-2038','Dirección distinta en dos documentos','Baja'),
  ('RCL-2047','Póliza contratada pocas semanas antes del siniestro','Media')
) as v(codigo, descr, gravedad)
join public.reclamos r on r.codigo = v.codigo;

-- Listas de sancionados
insert into public.verificaciones_listas (reclamo_id, persona, lista, resultado)
select r.id, v.persona, v.lista, v.resultado
from (values
  ('RCL-2041','Reclamante','UIF · OFAC','Sin coincidencia'),
  ('RCL-2041','Beneficiario 1','UIF · OFAC','Sin coincidencia'),
  ('RCL-2041','Beneficiario 2','UIF · OFAC','Coincidencia posible'),
  ('RCL-2038','Reclamante','UIF · OFAC','Sin coincidencia')
) as v(codigo, persona, lista, resultado)
join public.reclamos r on r.codigo = v.codigo;

-- Vínculos (posibles redes)
insert into public.vinculos_reclamos (reclamo_id, reclamo_vinculado_id, motivo, similitud)
select a.id, b.id, v.motivo, v.similitud
from (values
  ('RCL-2041','RCL-1987','Mismo teléfono y dirección', 92),
  ('RCL-2038','RCL-1904','Misma dirección', 81),
  ('RCL-2038','RCL-1855','Mismo teléfono', 74),
  ('RCL-2038','RCL-1790','Asegurado en común', 63)
) as v(c1, c2, motivo, similitud)
join public.reclamos a on a.codigo = v.c1
join public.reclamos b on b.codigo = v.c2;

-- Evaluaciones del agente (resultado de «npm run agente», modo reglas)
insert into public.evaluaciones_agente (reclamo_id, puntaje, prioridad, resumen, motivos, accion_sugerida, herramientas, modo)
select r.id, v.puntaje, v.prioridad, v.resumen, v.motivos::jsonb, v.accion,
       array['calcular_riesgo','buscar_casos_similares','revisar_documentos','consultar_listas'], 'reglas'
from (values
  ('RCL-2041', 100, 'Crítica', 'Prioridad crítica (100/100). Señales principales: 3 inconsistencias detectadas; monto reclamado mayor al valor asegurado.',
     '["3 inconsistencias detectadas","Monto reclamado mayor al valor asegurado","Posible coincidencia en listas de sancionados","Siniestro 41 días después de contratar la póliza"]',
     'Revisar hoy con prioridad. Verificar los casos vinculados y evaluar derivar a Legal antes de pagar.'),
  ('RCL-2038', 49, 'Alta', 'Prioridad alta (49/100). Señales principales: 3 casos vinculados por datos en común; 2 reclamos previos del mismo asegurado.',
     '["3 casos vinculados por datos en común","2 reclamos previos del mismo asegurado","1 inconsistencia detectada"]',
     'Revisar en el día y confirmar las señales detectadas antes de decidir.'),
  ('RCL-2052', 5, 'Baja', 'Prioridad baja (5/100). Señal: 1 documento faltante.', '["1 documento faltante"]', 'Sin señales de alerta. Puede seguir el trámite normal.'),
  ('RCL-2047', 65, 'Alta', 'Prioridad alta (65/100). Señales principales: monto reclamado mayor al valor asegurado; siniestro 28 días después de contratar la póliza.',
     '["Monto reclamado mayor al valor asegurado","Siniestro 28 días después de contratar la póliza","2 documentos faltantes","1 inconsistencia detectada"]',
     'Revisar en el día y confirmar las señales detectadas antes de decidir.'),
  ('RCL-2033', 0, 'Baja', 'Prioridad baja (0/100). No se encontraron señales de alerta.', '[]', 'Sin señales de alerta. Puede seguir el trámite normal.'),
  ('RCL-2029', 0, 'Baja', 'Prioridad baja (0/100). No se encontraron señales de alerta.', '[]', 'Sin señales de alerta. Puede seguir el trámite normal.'),
  ('RCL-2025', 0, 'Baja', 'Prioridad baja (0/100). No se encontraron señales de alerta.', '[]', 'Sin señales de alerta. Puede seguir el trámite normal.')
) as v(codigo, puntaje, prioridad, resumen, motivos, accion)
join public.reclamos r on r.codigo = v.codigo;

-- Decisiones de los reclamos históricos
insert into public.decisiones (reclamo_id, usuario_id, tipo, justificacion, falsa_alarma)
select r.id, u.id, v.tipo, v.just, false
from (values
  ('RCL-1987','Rechazar','Exclusión expresa, cláusula 4.2 (documentación adulterada).'),
  ('RCL-1904','Aprobar','Cobertura vigente y documentación completa.'),
  ('RCL-1855','Rechazar','Documentos falsos detectados en la revisión.'),
  ('RCL-1790','Aprobar','Sin alertas; cobertura vigente.')
) as v(codigo, tipo, just)
join public.reclamos r on r.codigo = v.codigo
cross join (select id from public.usuarios where correo = 'analista@wayz.demo') u;

-- Plazo legal del reclamo RCL-2041 (18 días restantes de 30)
insert into public.plazos_legales (reclamo_id, dias_totales, vence_en)
select id, 30, current_date + 18 from public.reclamos where codigo = 'RCL-2041';

-- Bitácora (usuario nulo = acción del sistema)
insert into public.bitacora (reclamo_id, usuario_id, accion, detalle)
select r.id, u.id, v.accion, v.detalle
from (values
  ('RCL-2041', null, 'Asignación', 'Caso asignado al analista'),
  ('RCL-2041', null, 'Alerta', 'Documento faltante: informe de peritaje'),
  ('RCL-2041', 'analista@wayz.demo', 'Consulta de listas', 'Cruce de sancionados'),
  ('RCL-2038', null, 'Asignación', 'Caso asignado al analista')
) as v(codigo, correo, accion, detalle)
join public.reclamos r on r.codigo = v.codigo
left join public.usuarios u on u.correo = v.correo;

-- Notificaciones del analista
insert into public.notificaciones (usuario_id, tipo, texto, ruta, leida)
select u.id, v.tipo, v.texto, v.ruta, v.leida
from (values
  ('info','Nuevo caso asignado: RCL-2052. Inicia la evaluación.','/expediente/RCL-2052/resumen', false),
  ('alerta','Alerta: posible red de fraude vinculada a RCL-2038.','/expediente/RCL-2038/similares', false),
  ('plazo','Plazo próximo a vencer en 2 casos.','/reclamos', false),
  ('info','La decisión del caso RCL-2019 fue registrada en la bitácora.','/historial', true)
) as v(tipo, texto, ruta, leida)
cross join (select id from public.usuarios where correo = 'analista@wayz.demo') u;
