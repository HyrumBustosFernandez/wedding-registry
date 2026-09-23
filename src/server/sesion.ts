import 'server-only';
import { cookies } from 'next/headers';

/*
 * Sesión de edición. Una clave compartida, que los novios reciben aparte del
 * link, abre el Modo edición. No es un sistema de cuentas: es el mínimo para
 * que un invitado no pueda reescribir la página sin querer.
 *
 * La cookie guarda un HMAC del valor, no la clave, y va httpOnly para que el
 * JavaScript de la página no pueda leerla.
 */

const COOKIE = 'edicion';
const VALOR = 'ok';
const DURACION = 60 * 60 * 12; // 12 horas

function claveConfigurada(): string | null {
  return process.env.EDIT_PASSWORD ?? null;
}

export function hayClaveConfigurada(): boolean {
  return Boolean(claveConfigurada());
}

async function firmar(valor: string, secreto: string): Promise<string> {
  const clave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const firma = await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(valor));
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Comparación en tiempo constante, para no filtrar la clave por timing. */
function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let distintos = 0;
  for (let i = 0; i < a.length; i++) distintos |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return distintos === 0;
}

/** True si la petición actual trae una sesión de edición válida. */
export async function puedeEditar(): Promise<boolean> {
  const secreto = claveConfigurada();
  if (!secreto) return false;

  const cookie = (await cookies()).get(COOKIE)?.value;
  if (!cookie) return false;

  return iguales(cookie, await firmar(VALOR, secreto));
}

/** Valida la clave y, si calza, abre la sesión. Devuelve si lo logró. */
export async function abrirSesion(claveIngresada: string): Promise<boolean> {
  const secreto = claveConfigurada();
  if (!secreto) return false;
  if (!iguales(claveIngresada, secreto)) return false;

  (await cookies()).set(COOKIE, await firmar(VALOR, secreto), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURACION,
  });
  return true;
}

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
