import type { Linea } from '@/hooks/useCarrito';

/**
 * Copia de los aportes del invitado, guardada solo en su navegador
 * (`localStorage`). Nunca sale del dispositivo: sirve para que vuelva y vea
 * lo que aportó, o retome un aporte que quedó a medias.
 *
 * El navegador puede negar el almacenamiento (modo incógnito, datos
 * bloqueados) o devolverlo vacío; por eso todo va en try/catch y la página
 * funciona igual sin él.
 */

const CLAVE = 'lista-regalos:aportes:v1';
const EVENTO = 'lista-regalos:aportes';

export type EstadoAporte = 'pendiente' | 'realizado';

export type AporteGuardado = {
  id: string;
  /** ISO 8601, de la última vez que cambió. */
  fecha: string;
  estado: EstadoAporte;
  lineas: Linea[];
  total: number;
  nombre: string;
  correo: string;
  mensaje: string;
  /** El carrito en crudo, para poder retomarlo tal como quedó. */
  carro: Record<string, number>;
  montos: Record<string, number>;
  libre: number;
};

const VACIO: readonly AporteGuardado[] = [];

let crudoCache: string | null = null;
let listaCache: readonly AporteGuardado[] = VACIO;

function leerCrudo(): string | null {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

/** La lista guardada, del más reciente al más antiguo. Misma referencia si no cambió. */
export function leerAportes(): readonly AporteGuardado[] {
  const crudo = leerCrudo();
  if (crudo === crudoCache) return listaCache;
  crudoCache = crudo;
  try {
    const datos: unknown = crudo ? JSON.parse(crudo) : [];
    listaCache = Array.isArray(datos) ? (datos as AporteGuardado[]) : VACIO;
  } catch {
    listaCache = VACIO;
  }
  return listaCache;
}

export function leerAportesServidor(): readonly AporteGuardado[] {
  return VACIO;
}

function escribir(lista: readonly AporteGuardado[]): void {
  try {
    if (lista.length === 0) window.localStorage.removeItem(CLAVE);
    else window.localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    /* Sin almacenamiento no hay copia; el aporte sigue su curso igual. */
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Crea o reemplaza un aporte por su id y lo deja primero en la lista. */
export function guardarAporte(aporte: AporteGuardado): void {
  escribir([aporte, ...leerAportes().filter((a) => a.id !== aporte.id)]);
}

export function quitarAporte(id: string): void {
  escribir(leerAportes().filter((a) => a.id !== id));
}

export function borrarAportes(): void {
  escribir(VACIO);
}

/** Para `useSyncExternalStore`: avisa los cambios de esta pestaña y de otras. */
export function suscribirAportes(alCambiar: () => void): () => void {
  window.addEventListener(EVENTO, alCambiar);
  window.addEventListener('storage', alCambiar);
  return () => {
    window.removeEventListener(EVENTO, alCambiar);
    window.removeEventListener('storage', alCambiar);
  };
}

export function nuevoIdAporte(): string {
  return `aporte-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
