import type { Foto } from './esquema';

/**
 * Las fotos del sitio. Los archivos viven en `public/fotos/`.
 *
 * Para cambiar una, se reemplaza el archivo o se apunta a otro nombre. Para
 * agregar una al carrusel, basta con sumarla a `CARRUSEL`.
 */

/** Fondo a sangre completa del comienzo de la página, detrás de los nombres. */
export const FONDO_INICIO: Foto = {
  url: '/fotos/fondo-inicio.jpg',
  alt: 'Ailyne y Jose',
};

/** Fondo a sangre completa del cierre de la página. */
export const FONDO_FINAL: Foto = {
  url: '/fotos/fondo-final.jpg',
  alt: 'Ailyne y Jose',
};

/**
 * Las fotos del carrusel, en orden. Se muestran 7 segundos cada una y vuelven
 * a empezar al llegar al final.
 */
export const CARRUSEL: Foto[] = [
  { url: '/fotos/galeria-01.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-02.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-03.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-04.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-05.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-06.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-07.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-08.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-09.jpg', alt: 'Ailyne y Jose' },
  { url: '/fotos/galeria-10.jpg', alt: 'Ailyne y Jose' },
];

/** Segundos que se ve cada foto del carrusel antes de pasar a la siguiente. */
export const SEGUNDOS_POR_FOTO = 7;

/** Miniaturas cuadradas de la lista de regalos, por id de regalo. */
export const FOTOS_REGALOS: Record<string, Foto> = {};

/** La foto de un regalo, o null si todavía no tiene. */
export function fotoDeRegalo(id: string): Foto | null {
  return FOTOS_REGALOS[id] ?? null;
}
