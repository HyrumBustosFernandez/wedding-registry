import type { Foto } from './esquema';

/**
 * Las fotos del sitio.
 *
 * No son contenido editable: los novios escriben los textos desde el Modo
 * edición, y las fotos las agregas tú acá. Por eso viven en código y no en la
 * base — así un guardado de ellos nunca las pisa.
 *
 * Para agregar una:
 *   1. Deja el archivo en `public/fotos/` (por ejemplo `public/fotos/portada.jpg`).
 *   2. Apunta acá a esa ruta, con un `alt` que describa lo que se ve.
 *   3. Despliega.
 *
 * Mientras una entrada sea `null` se dibuja el placeholder rayado del diseño,
 * así que el sitio se ve bien aunque falten fotos.
 */

/** La foto grande de la portada, en marco polaroid. Ideal 1920×1080. */
export const FOTO_PORTADA: Foto | null = null;

/**
 * Las miniaturas cuadradas de la lista de regalos, por id de regalo.
 * Ideal ≥400×400.
 *
 * Los ids de los regalos de la semilla son los de `semilla.ts`
 * (`regalo-japon`, `regalo-ryokan`, …). Si los novios agregan un regalo nuevo
 * desde el editor, su id se genera solo y se ve en la base, en el documento
 * JSON de la tabla `contenido`.
 */
export const FOTOS_REGALOS: Record<string, Foto> = {
  // 'regalo-japon': { url: '/fotos/japon.jpg', alt: 'Calle de Tokio de noche' },
};

/** La foto de un regalo, o null si todavía no tiene. */
export function fotoDeRegalo(id: string): Foto | null {
  return FOTOS_REGALOS[id] ?? null;
}
