import 'server-only';
import { neon } from '@neondatabase/serverless';
import type { Contenido } from '@/contenido/esquema';
import { VERSION_ESQUEMA } from '@/contenido/esquema';
import { SEMILLA } from '@/contenido/semilla';

/*
 * Capa de acceso a datos. Es la única puerta al contenido guardado: nada más
 * toca la base directamente.
 *
 * Si no hay DATABASE_URL configurada el sitio sigue funcionando en modo solo
 * lectura sobre la semilla, así el repo se puede levantar y desplegar sin
 * provisionar nada. `hayBaseDeDatos()` permite avisarlo en la interfaz.
 */

const FILA = 1;

function conexion() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export function hayBaseDeDatos(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let tablaLista = false;

async function asegurarTabla(sql: NonNullable<ReturnType<typeof conexion>>) {
  if (tablaLista) return;
  await sql`
    CREATE TABLE IF NOT EXISTS contenido (
      id INTEGER PRIMARY KEY,
      documento JSONB NOT NULL,
      actualizado TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  tablaLista = true;
}

/**
 * Completa con la semilla los campos que falten, para que un documento guardado
 * con un esquema viejo no deje la página a medias tras un despliegue.
 */
function normalizar(guardado: Partial<Contenido> | null | undefined): Contenido {
  if (!guardado) return SEMILLA;
  return {
    ...SEMILLA,
    ...guardado,
    version: VERSION_ESQUEMA,
    pareja: { ...SEMILLA.pareja, ...guardado.pareja },
    portada: { ...SEMILLA.portada, ...guardado.portada },
    boda: { ...SEMILLA.boda, ...guardado.boda },
    regalos: { ...SEMILLA.regalos, ...guardado.regalos },
    libre: { ...SEMILLA.libre, ...guardado.libre },
    pie: { ...SEMILLA.pie, ...guardado.pie },
    opciones: { ...SEMILLA.opciones, ...guardado.opciones },
  };
}

export async function leerContenido(): Promise<Contenido> {
  const sql = conexion();
  if (!sql) return SEMILLA;

  try {
    await asegurarTabla(sql);
    const filas = await sql`SELECT documento FROM contenido WHERE id = ${FILA}`;
    return normalizar(filas[0]?.documento as Contenido | undefined);
  } catch (error) {
    /* Una caída de la base no debe dejar el sitio en blanco el día de la boda. */
    console.error('[almacen] no se pudo leer el contenido, se usa la semilla:', error);
    return SEMILLA;
  }
}

export async function guardarContenido(contenido: Contenido): Promise<void> {
  const sql = conexion();
  if (!sql) throw new Error('No hay base de datos configurada (falta DATABASE_URL).');

  await asegurarTabla(sql);
  const documento = JSON.stringify({ ...contenido, version: VERSION_ESQUEMA });
  await sql`
    INSERT INTO contenido (id, documento, actualizado)
    VALUES (${FILA}, ${documento}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET documento = EXCLUDED.documento, actualizado = now()
  `;
}
