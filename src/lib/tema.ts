import type { CSSProperties } from 'react';
import type { Config, EstiloFoto } from '@/config';

type RGB = [number, number, number];

const ACENTO_BASE = '#b06e6e';
/** El oscuro de la paleta original, verificado a 5.65:1 sobre blanco. */
const ACENTO_OSC_BASE = '#905855';
/** Mezcla usada para derivar el oscuro de un acento configurable (§3). */
const MEZCLA_OSCURA: RGB = [0x2a, 0x12, 0x06];
const PROPORCION_ACENTO = 0.76;

function aRgb(hex: string): RGB {
  const limpio = hex.trim().replace('#', '');
  const largo =
    limpio.length === 3
      ? limpio
          .split('')
          .map((c) => c + c)
          .join('')
      : limpio;
  return [
    parseInt(largo.slice(0, 2), 16),
    parseInt(largo.slice(2, 4), 16),
    parseInt(largo.slice(4, 6), 16),
  ];
}

function aHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function rgba([r, g, b]: RGB, alpha: number): string {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Equivalente a color-mix(in srgb, acento <p>%, mezcla). */
function mezclar(a: RGB, b: RGB, proporcion: number): RGB {
  return [0, 1, 2].map((i) => a[i] * proporcion + b[i] * (1 - proporcion)) as RGB;
}

function luminancia([r, g, b]: RGB): number {
  const canal = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

/** Contraste WCAG contra blanco. Debe ser ≥4.5:1 para texto. */
export function contrasteSobreBlanco(hex: string): number {
  return 1.05 / (luminancia(aRgb(hex)) + 0.05);
}

/**
 * Convierte el flag `acento` en las variables CSS que el elemento raíz necesita
 * sobrescribir. Con el acento por defecto no devuelve nada: tokens.css ya las trae.
 */
export function variablesDeAcento(acento: string): CSSProperties {
  if (acento.trim().toLowerCase() === ACENTO_BASE) return {};

  const rgb = aRgb(acento);
  const oscuro = aHex(mezclar(rgb, MEZCLA_OSCURA, PROPORCION_ACENTO));

  if (process.env.NODE_ENV !== 'production') {
    const ratio = contrasteSobreBlanco(oscuro);
    if (ratio < 4.5) {
      console.warn(
        `[tema] El acento ${acento} deriva ${oscuro}, con ${ratio.toFixed(2)}:1 sobre blanco. ` +
          'Falla AA (4.5:1) para texto — elige un acento más oscuro.',
      );
    }
  }

  return {
    '--acento': acento,
    '--acento-osc': oscuro,
    '--acento-18': rgba(rgb, 0.18),
    '--acento-20': rgba(rgb, 0.2),
    '--acento-22': rgba(rgb, 0.22),
    '--acento-35': rgba(rgb, 0.35),
  } as CSSProperties;
}

/** Geometría del marco de foto según el flag `estiloFoto` (§8.3). */
export function variablesDeFoto(estilo: EstiloFoto): CSSProperties {
  if (estilo === 'polaroid') return {};
  return { '--foto-giro': '0deg', '--foto-chin': '0.7rem' } as CSSProperties;
}

/** Todas las variables que el flag de configuración inyecta en el elemento raíz. */
export function variablesDeTema(config: Config): CSSProperties {
  return { ...variablesDeAcento(config.acento), ...variablesDeFoto(config.estiloFoto) };
}

export { ACENTO_BASE, ACENTO_OSC_BASE };
