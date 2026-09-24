'use server';

import { revalidatePath } from 'next/cache';
import type { Contenido } from '@/contenido/esquema';
import { guardarContenido } from './almacen';
import { abrirSesion, cerrarSesion, puedeEditar } from './sesion';

/*
 * Acciones de servidor del editor.
 *
 * Next avisa que un Server Action es alcanzable por POST directo, no solo desde
 * la interfaz: por eso cada acción que muta algo vuelve a comprobar la sesión
 * acá dentro, sin confiar en que el cliente haya escondido el botón.
 */

export type Resultado = { ok: true } | { ok: false; error: string };

/* Las fotos no pasan por acá: suben del navegador directo a Blob, con el token
   que firma /api/fotos. */

export async function entrarAEdicion(_previo: unknown, formData: FormData): Promise<Resultado> {
  const clave = String(formData.get('clave') ?? '');
  if (!clave) return { ok: false, error: 'Escribe la clave.' };

  if (!(await abrirSesion(clave))) {
    return { ok: false, error: 'Clave incorrecta.' };
  }

  revalidatePath('/');
  return { ok: true };
}

export async function salirDeEdicion(): Promise<void> {
  await cerrarSesion();
  revalidatePath('/');
}

export async function guardar(contenido: Contenido): Promise<Resultado> {
  if (!(await puedeEditar())) {
    return { ok: false, error: 'Tu sesión de edición expiró. Vuelve a entrar.' };
  }

  try {
    await guardarContenido(contenido);
    revalidatePath('/');
    return { ok: true };
  } catch (error) {
    console.error('[acciones] falló el guardado:', error);
    const detalle = error instanceof Error ? error.message : 'Error desconocido';
    return { ok: false, error: `No se pudo guardar: ${detalle}` };
  }
}
