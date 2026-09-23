'use server';

import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
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

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

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

export type ResultadoFoto = { ok: true; url: string } | { ok: false; error: string };

export async function subirFoto(formData: FormData): Promise<ResultadoFoto> {
  if (!(await puedeEditar())) {
    return { ok: false, error: 'Tu sesión de edición expiró. Vuelve a entrar.' };
  }

  const archivo = formData.get('archivo');
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { ok: false, error: 'Elige una imagen.' };
  }
  if (!TIPOS_IMAGEN.includes(archivo.type)) {
    return { ok: false, error: 'Formato no soportado. Usa JPG, PNG, WebP o AVIF.' };
  }
  if (archivo.size > MAX_BYTES) {
    return { ok: false, error: 'La imagen pesa más de 8 MB. Súbela más liviana.' };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: 'Falta configurar el almacenamiento de fotos (BLOB_READ_WRITE_TOKEN).' };
  }

  try {
    const { url } = await put(`fotos/${archivo.name}`, archivo, {
      access: 'public',
      addRandomSuffix: true,
    });
    return { ok: true, url };
  } catch (error) {
    console.error('[acciones] falló la subida de foto:', error);
    return { ok: false, error: 'No se pudo subir la imagen. Inténtalo de nuevo.' };
  }
}
