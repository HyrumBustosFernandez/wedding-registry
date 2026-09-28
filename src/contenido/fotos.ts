import type { Foto } from './esquema';

/**
 * Las fotos del sitio.
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
 * Ideal ≥400×400. Los ids son los de `contenido.ts` (`regalo-japon`,
 * `regalo-ryokan`, …).
 */
export const FOTOS_REGALOS: Record<string, Foto> = {
  // 'regalo-japon': { url: '/fotos/japon.jpg', alt: 'Calle de Tokio de noche' },
};

/** La foto de un regalo, o null si todavía no tiene. */
export function fotoDeRegalo(id: string): Foto | null {
  return FOTOS_REGALOS[id] ?? null;
}
