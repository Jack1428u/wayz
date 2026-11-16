-- Esquema de Wayz: detección de fraude en seguros (PostgreSQL / Supabase).
-- Nombres en español y snake_case; id uuid; estados con CHECK.
-- Ejecutar en este orden: 01-esquema.sql, 02-seguridad.sql, 03-datos-ejemplo.sql

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check (codigo in ('analista','lider','gerente','legal','auditor','tecnico','admin')),
  nombre text not null,
  creado_en timestamptz not null default now()
);
comment on table public.roles is 'Roles de la aplicación; cada rol ve solo sus secciones (HU-027).';

create table public.usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users(id) on delete set null,
  nombre text not null,
  correo text not null unique,
  rol_id uuid not null references public.roles(id),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);
comment on table public.usuarios is 'Perfil de cada persona. La contraseña NO se guarda aquí: la gestiona Supabase Auth (auth_id).';

create table public.asegurados (
  id uuid primary key default gen_random_uuid(),
  tipo_documento text not null check (tipo_documento in ('DNI','RUC','CE')),
  numero_documento text not null,
  nombre_completo text not null,
  correo text,
  telefono text,
  direccion text,
  creado_en timestamptz not null default now(),
  unique (tipo_documento, numero_documento)
);
comment on table public.asegurados is 'Personas o empresas aseguradas.';

create table public.polizas (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique check (numero ~ '^PL-[0-9]{6}$'),
  asegurado_id uuid not null references public.asegurados(id),
  ramo text not null check (ramo in ('Vehicular','Salud','Hogar','Vida')),
  fecha_inicio date not null,
  fecha_fin date not null,
  valor_asegurado numeric(12,2) not null check (valor_asegurado > 0),
  creado_en timestamptz not null default now(),
  check (fecha_fin > fecha_inicio)
);
comment on table public.polizas is 'Pólizas contratadas por los asegurados.';

create table public.reclamos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check (codigo ~ '^RCL-[0-9]{4}$'),
  poliza_id uuid not null references public.polizas(id),
  reclamante_nombre text not null,
  reclamante_correo text,
  reclamante_telefono text,
  tipo text not null check (tipo in ('Vehicular','Salud','Hogar','Vida')),
  fecha_hecho date not null,
  fecha_denuncia date,
  monto_estimado numeric(12,2) not null check (monto_estimado > 0),
  descripcion text,
  estado text not null default 'Nuevo' check (estado in ('Nuevo','En revisión','Pendiente','Decidido')),
  riesgo text not null default 'Medio' check (riesgo in ('Alto','Medio','Bajo')),
  urgencia text not null default 'Media' check (urgencia in ('Alta','Media','Baja')),
  plazo_vence date,
  analista_id uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);
comment on table public.reclamos is 'Reclamos de siniestros que los analistas evalúan.';

create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  nombre text not null,
  estado text not null check (estado in ('Entregado','Faltante')),
  tamano_bytes bigint check (tamano_bytes >= 0),
  creado_en timestamptz not null default now()
);
comment on table public.documentos is 'Documentos entregados o faltantes de cada reclamo.';

create table public.inconsistencias (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  descripcion text not null,
  gravedad text not null check (gravedad in ('Alta','Media','Baja')),
  revisada boolean not null default false,
  creado_en timestamptz not null default now()
);
comment on table public.inconsistencias is 'Inconsistencias detectadas en un reclamo.';

create table public.verificaciones_listas (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  persona text not null,
  lista text not null,
  resultado text not null check (resultado in ('Sin coincidencia','Coincidencia posible','Coincidencia confirmada')),
  creado_en timestamptz not null default now()
);
comment on table public.verificaciones_listas is 'Consultas a listas de sancionados (UIF, OFAC).';

create table public.vinculos_reclamos (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  reclamo_vinculado_id uuid not null references public.reclamos(id) on delete cascade,
  motivo text not null,
  similitud smallint not null check (similitud between 0 and 100),
  creado_en timestamptz not null default now(),
  check (reclamo_id <> reclamo_vinculado_id)
);
comment on table public.vinculos_reclamos is 'Reclamos vinculados por datos en común (posibles redes de fraude).';

create table public.evaluaciones_agente (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  puntaje smallint not null check (puntaje between 0 and 100),
  prioridad text not null check (prioridad in ('Crítica','Alta','Media','Baja')),
  resumen text not null,
  motivos jsonb not null default '[]'::jsonb,
  accion_sugerida text,
  herramientas text[] not null default '{}',
  modo text not null check (modo in ('gemini','reglas')),
  modelo text,
  creado_en timestamptz not null default now()
);
comment on table public.evaluaciones_agente is 'Sugerencias del agente de IA. Son recomendaciones: la decisión es del analista.';

create table public.decisiones (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  usuario_id uuid not null references public.usuarios(id),
  tipo text not null check (tipo in ('Aprobar','Rechazar','Derivar a Legal')),
  justificacion text not null check (char_length(justificacion) >= 10),
  falsa_alarma boolean not null default false,
  creado_en timestamptz not null default now()
);
comment on table public.decisiones is 'Decisiones humanas sobre cada reclamo, con justificación obligatoria.';

create table public.escalamientos (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null references public.reclamos(id) on delete cascade,
  de_usuario_id uuid not null references public.usuarios(id),
  a_usuario_id uuid not null references public.usuarios(id),
  motivo text not null,
  adjunta_resumen boolean not null default true,
  creado_en timestamptz not null default now()
);
comment on table public.escalamientos is 'Solicitudes de apoyo a un superior o colega.';

create table public.bitacora (
  id bigint generated always as identity primary key,
  reclamo_id uuid references public.reclamos(id) on delete set null,
  usuario_id uuid references public.usuarios(id) on delete set null,
  accion text not null,
  detalle text,
  creado_en timestamptz not null default now()
);
comment on table public.bitacora is 'Registro de auditoría: solo se agrega, nunca se modifica ni se borra.';

create table public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  tipo text not null check (tipo in ('info','alerta','plazo')),
  texto text not null,
  ruta text,
  leida boolean not null default false,
  creado_en timestamptz not null default now()
);
comment on table public.notificaciones is 'Avisos para cada usuario.';

create table public.plazos_legales (
  id uuid primary key default gen_random_uuid(),
  reclamo_id uuid not null unique references public.reclamos(id) on delete cascade,
  dias_totales integer not null default 30 check (dias_totales > 0),
  vence_en date not null,
  pausado boolean not null default false,
  creado_en timestamptz not null default now()
);
comment on table public.plazos_legales is 'Cronómetro del plazo legal de cada reclamo.';

create table public.extensiones_plazo (
  id uuid primary key default gen_random_uuid(),
  plazo_id uuid not null references public.plazos_legales(id) on delete cascade,
  dias integer not null check (dias between 1 and 30),
  justificacion text not null,
  usuario_id uuid not null references public.usuarios(id),
  creado_en timestamptz not null default now()
);
comment on table public.extensiones_plazo is 'Extensiones del plazo legal, con su justificación.';

create table public.preferencias_usuario (
  usuario_id uuid primary key references public.usuarios(id) on delete cascade,
  tema text not null default 'clara' check (tema in ('clara','calida','oscura','contraste')),
  modo_sol boolean not null default false,
  tamano_texto smallint not null default 100 check (tamano_texto between 90 and 150),
  contraste smallint not null default 60 check (contraste between 0 and 100),
  sonido boolean not null default true,
  creado_en timestamptz not null default now()
);
comment on table public.preferencias_usuario is 'Preferencias de lectura y accesibilidad de cada persona.';

-- Índices en las claves foráneas
create index on public.usuarios (rol_id);
create index on public.polizas (asegurado_id);
create index on public.reclamos (poliza_id);
create index on public.reclamos (analista_id);
create index on public.reclamos (estado, riesgo);
create index on public.documentos (reclamo_id);
create index on public.inconsistencias (reclamo_id);
create index on public.verificaciones_listas (reclamo_id);
create index on public.vinculos_reclamos (reclamo_id);
create index on public.vinculos_reclamos (reclamo_vinculado_id);
create index on public.evaluaciones_agente (reclamo_id, creado_en desc);
create index on public.decisiones (reclamo_id);
create index on public.decisiones (usuario_id);
create index on public.escalamientos (reclamo_id);
create index on public.escalamientos (de_usuario_id);
create index on public.escalamientos (a_usuario_id);
create index on public.bitacora (reclamo_id);
create index on public.bitacora (usuario_id);
create index on public.notificaciones (usuario_id, leida);
create index on public.extensiones_plazo (plazo_id);
create index on public.extensiones_plazo (usuario_id);

-- La bitácora es de solo agregar: se bloquean UPDATE y DELETE
create function public.bloquear_modificacion_bitacora()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'La bitácora es un registro de auditoría: no se puede modificar ni borrar.';
end;
$$;

create trigger bitacora_solo_agregar
before update or delete on public.bitacora
for each row execute function public.bloquear_modificacion_bitacora();

-- Vista de la bandeja (respeta los permisos de quien consulta)
create view public.vista_bandeja with (security_invoker = true) as
select
  r.id,
  r.codigo,
  a.nombre_completo as asegurado,
  r.tipo,
  r.riesgo,
  r.urgencia,
  r.estado,
  (r.plazo_vence - current_date) as dias_restantes,
  e.prioridad as prioridad_agente,
  e.puntaje as puntaje_agente
from public.reclamos r
join public.polizas p on p.id = r.poliza_id
join public.asegurados a on a.id = p.asegurado_id
left join lateral (
  select ea.prioridad, ea.puntaje
  from public.evaluaciones_agente ea
  where ea.reclamo_id = r.id
  order by ea.creado_en desc
  limit 1
) e on true;
comment on view public.vista_bandeja is 'Listado de la bandeja con la última evaluación del agente.';
