-- Seguridad por filas (RLS): nadie anónimo entra; cada rol ve y modifica solo lo que le corresponde.
-- Las funciones auxiliares viven en el esquema "private", que la API pública de Supabase no expone.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- Quién es la persona conectada y qué rol tiene
create function private.rol_actual()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select r.codigo
  from public.usuarios u
  join public.roles r on r.id = u.rol_id
  where u.auth_id = (select auth.uid()) and u.activo
$$;

create function private.usuario_actual()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id from public.usuarios u where u.auth_id = (select auth.uid()) and u.activo
$$;

revoke execute on function private.rol_actual() from public, anon;
revoke execute on function private.usuario_actual() from public, anon;
grant execute on function private.rol_actual() to authenticated;
grant execute on function private.usuario_actual() to authenticated;

-- Al crear una cuenta en Supabase Auth con el mismo correo de un perfil, se enlaza sola
create function public.enlazar_usuario_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.usuarios set auth_id = new.id where lower(correo) = lower(new.email) and auth_id is null;
  return new;
end;
$$;
revoke execute on function public.enlazar_usuario_auth() from public, anon, authenticated;

create trigger al_crear_cuenta_enlazar_perfil
after insert on auth.users
for each row execute function public.enlazar_usuario_auth();

-- Activar RLS en todas las tablas
alter table public.roles enable row level security;
alter table public.usuarios enable row level security;
alter table public.asegurados enable row level security;
alter table public.polizas enable row level security;
alter table public.reclamos enable row level security;
alter table public.documentos enable row level security;
alter table public.inconsistencias enable row level security;
alter table public.verificaciones_listas enable row level security;
alter table public.vinculos_reclamos enable row level security;
alter table public.evaluaciones_agente enable row level security;
alter table public.decisiones enable row level security;
alter table public.escalamientos enable row level security;
alter table public.bitacora enable row level security;
alter table public.notificaciones enable row level security;
alter table public.plazos_legales enable row level security;
alter table public.extensiones_plazo enable row level security;
alter table public.preferencias_usuario enable row level security;

-- Lectura: cualquier persona con perfil activo
create policy "ver_roles" on public.roles for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_usuarios" on public.usuarios for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_asegurados" on public.asegurados for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_polizas" on public.polizas for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_reclamos" on public.reclamos for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_documentos" on public.documentos for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_inconsistencias" on public.inconsistencias for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_verificaciones" on public.verificaciones_listas for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_vinculos" on public.vinculos_reclamos for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_evaluaciones" on public.evaluaciones_agente for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_decisiones" on public.decisiones for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_plazos" on public.plazos_legales for select to authenticated using ((select private.rol_actual()) is not null);
create policy "ver_extensiones" on public.extensiones_plazo for select to authenticated using ((select private.rol_actual()) is not null);

-- Bitácora: la leen roles de control; cualquiera con perfil puede agregar un registro propio (nunca editar ni borrar)
create policy "ver_bitacora" on public.bitacora for select to authenticated
  using ((select private.rol_actual()) in ('lider','gerente','legal','auditor','admin'));
create policy "agregar_bitacora" on public.bitacora for insert to authenticated
  with check ((select private.rol_actual()) is not null and usuario_id = (select private.usuario_actual()));

-- Reclamos y su documentación: los registran y actualizan analistas y líderes
create policy "crear_reclamos" on public.reclamos for insert to authenticated
  with check ((select private.rol_actual()) in ('analista','lider'));
create policy "actualizar_reclamos" on public.reclamos for update to authenticated
  using ((select private.rol_actual()) in ('analista','lider','gerente'))
  with check ((select private.rol_actual()) in ('analista','lider','gerente'));
create policy "crear_documentos" on public.documentos for insert to authenticated
  with check ((select private.rol_actual()) in ('analista','lider'));
create policy "actualizar_inconsistencias" on public.inconsistencias for update to authenticated
  using ((select private.rol_actual()) in ('analista','lider','gerente'))
  with check ((select private.rol_actual()) in ('analista','lider','gerente'));

-- Decisiones: las toma una persona con permiso y siempre queda a su nombre
create policy "registrar_decisiones" on public.decisiones for insert to authenticated
  with check ((select private.rol_actual()) in ('analista','lider','gerente','legal')
              and usuario_id = (select private.usuario_actual()));

-- Escalamientos: los ve quien los envía o recibe, y los roles de control
create policy "ver_escalamientos" on public.escalamientos for select to authenticated
  using (de_usuario_id = (select private.usuario_actual()) or a_usuario_id = (select private.usuario_actual())
         or (select private.rol_actual()) in ('lider','gerente','auditor'));
create policy "crear_escalamientos" on public.escalamientos for insert to authenticated
  with check ((select private.rol_actual()) in ('analista','lider') and de_usuario_id = (select private.usuario_actual()));

-- Plazo legal: lo administra el área legal
create policy "actualizar_plazos" on public.plazos_legales for update to authenticated
  using ((select private.rol_actual()) = 'legal') with check ((select private.rol_actual()) = 'legal');
create policy "extender_plazos" on public.extensiones_plazo for insert to authenticated
  with check ((select private.rol_actual()) = 'legal' and usuario_id = (select private.usuario_actual()));

-- Notificaciones y preferencias: cada persona solo las suyas
create policy "ver_mis_notificaciones" on public.notificaciones for select to authenticated using (usuario_id = (select private.usuario_actual()));
create policy "marcar_mis_notificaciones" on public.notificaciones for update to authenticated
  using (usuario_id = (select private.usuario_actual())) with check (usuario_id = (select private.usuario_actual()));
create policy "ver_mis_preferencias" on public.preferencias_usuario for select to authenticated using (usuario_id = (select private.usuario_actual()));
create policy "crear_mis_preferencias" on public.preferencias_usuario for insert to authenticated with check (usuario_id = (select private.usuario_actual()));
create policy "cambiar_mis_preferencias" on public.preferencias_usuario for update to authenticated
  using (usuario_id = (select private.usuario_actual())) with check (usuario_id = (select private.usuario_actual()));

-- Administración de usuarios: solo el rol administrador
create policy "admin_crea_usuarios" on public.usuarios for insert to authenticated with check ((select private.rol_actual()) = 'admin');
create policy "admin_edita_usuarios" on public.usuarios for update to authenticated
  using ((select private.rol_actual()) = 'admin') with check ((select private.rol_actual()) = 'admin');

-- El agente de IA (cuenta con rol tecnico) guarda sus evaluaciones
create policy "agente_guarda_evaluaciones" on public.evaluaciones_agente for insert to authenticated
  with check ((select private.rol_actual()) = 'tecnico');

-- Adjuntos reales: columnas de autenticidad, bucket privado "documentos" y sus permisos
alter table public.documentos
  add column hash_sha256 text, add column ruta_storage text, add column tipo_mime text, add column archivo_modificado_en timestamptz,
  add column autenticidad text not null default 'Sin verificar' check (autenticidad in ('Verificado','Sospechoso','Sin verificar')),
  add column autenticidad_detalle text;
create index on public.documentos (hash_sha256);
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documentos', 'documentos', false, 20971520, array['application/pdf','image/png','image/jpeg','application/zip','text/plain'])
on conflict (id) do nothing;
create policy "subir_adjuntos" on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos' and (select private.rol_actual()) in ('analista','lider'));
create policy "ver_adjuntos" on storage.objects for select to authenticated
  using (bucket_id = 'documentos' and (select private.rol_actual()) is not null);
create policy "actualizar_documentos" on public.documentos for update to authenticated
  using ((select private.rol_actual()) in ('analista','lider')) with check ((select private.rol_actual()) in ('analista','lider'));
create policy "crear_inconsistencias" on public.inconsistencias for insert to authenticated
  with check ((select private.rol_actual()) in ('analista','lider'));

-- El agente de la app (modo reglas) evalúa al registrar un reclamo
create policy "evaluar_al_registrar" on public.evaluaciones_agente for insert to authenticated
  with check ((select private.rol_actual()) in ('analista','lider') and modo = 'reglas');

-- Reintentar la subida del mismo archivo al mismo caso lo reemplaza (upsert): mismo permiso que subir (analista y lider).
create policy "reemplazar_adjuntos" on storage.objects for update to authenticated
  using (bucket_id = 'documentos' and (select private.rol_actual()) = any (array['analista','lider']))
  with check (bucket_id = 'documentos' and (select private.rol_actual()) = any (array['analista','lider']));
