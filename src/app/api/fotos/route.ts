import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { puedeEditar } from '@/server/sesion';

/*
 * Emisión de tokens para subir fotos directo del navegador a Vercel Blob.
 *
 * Un Server Action manda el archivo al servidor y recién de ahí a Blob, y en
 * Vercel el cuerpo de una petición topa en 4,5 MB: cualquier foto de celular
 * un poco pesada moría ahí. Con subida desde el cliente el archivo nunca pasa
 * por el servidor, que solo firma el permiso.
 */

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const respuesta = await handleUpload({
      body,
      request,
      /* Acá se decide si la subida se autoriza. Sin esta comprobación
         cualquiera podría escribir en el store apuntando a esta ruta. */
      onBeforeGenerateToken: async () => {
        if (!(await puedeEditar())) {
          throw new Error('Necesitas una sesión de edición para subir fotos.');
        }
        /* Sin el store conectado el SDK responde en inglés y hablando de
           variables de entorno; a los novios eso no les dice nada. */
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error('Todavía no se ha configurado el almacenamiento de fotos.');
        }
        return {
          allowedContentTypes: TIPOS_IMAGEN,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        /* La URL se guarda junto al resto del contenido cuando los novios
           aprietan Guardar, así que acá no hay nada que registrar. */
      },
    });

    return NextResponse.json(respuesta);
  } catch (error) {
    const detalle = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: detalle }, { status: 400 });
  }
}
