// Conexión con la base de datos (Supabase). Si faltan las claves en .env.local, la app sigue
// funcionando con los datos de demostración locales (modo sin conexión).
import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const CLAVE = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const hayBaseDeDatos = Boolean(URL && CLAVE);

export const supabase = hayBaseDeDatos
  ? createClient(URL, CLAVE, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
