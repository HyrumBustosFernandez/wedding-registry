/**
 * Esquema del contenido editable del sitio.
 *
 * Todo lo que los novios pueden cambiar desde el Modo edición vive acá dentro.
 * El documento se guarda entero como un JSON en la base; `version` permite
 * migrar si el esquema cambia más adelante.
 */

export const VERSION_ESQUEMA = 1;

export type Foto = {
  /** URL pública en Vercel Blob. Vacío = se dibuja el placeholder rayado. */
  url: string;
  alt: string;
  /** Pie de foto manuscrito. Solo lo usa la portada. */
  pie?: string;
};

/** Un dato suelto de la portada: FECHA / 21.11.2026. */
export type DatoPortada = {
  id: string;
  kicker: string;
  valor: string;
  /** Aplica tabular-nums. Para fechas, horas y cualquier cifra. */
  numerico: boolean;
};

/** Un bloque de "La boda": CEREMONIA / Viña Matetic / dirección y horario. */
export type BloqueBoda = {
  id: string;
  kicker: string;
  titulo: string;
  texto: string;
};

/** Un ítem de la lista de regalos. */
export type Regalo = {
  id: string;
  nombre: string;
  nota: string;
  foto: Foto | null;
  /** Monto sugerido del aporte, en CLP. */
  precio: number;
  /**
   * Partes necesarias para completarlo. `null` = sin meta: se aporta
   * voluntariamente, sin barra de progreso ni tope. Solo tiene efecto cuando
   * `opciones.mostrarMetas` está encendido.
   */
  objetivo: number | null;
  /** Partes ya cubiertas. Solo se muestra con metas encendidas. */
  regalados: number;
};

export type Opciones = {
  /**
   * Enciende metas, barra de progreso y el texto "X de Y regalados".
   * Apagado por defecto: la lista funciona como aporte voluntario.
   */
  mostrarMetas: boolean;
  mostrarMiniaturas: boolean;
  mostrarNotas: boolean;
  estiloFoto: 'polaroid' | 'marco';
  acento: string;
};

export type Contenido = {
  version: number;
  pareja: {
    nombreUno: string;
    /** La "y" manuscrita entre ambos nombres. */
    conjuncion: string;
    nombreDos: string;
  };
  portada: {
    kicker: string;
    datos: DatoPortada[];
    cita: string;
    firma: string;
    foto: Foto | null;
  };
  boda: {
    kicker: string;
    titulo: string;
    bloques: BloqueBoda[];
    enlace: { texto: string; href: string };
  };
  regalos: {
    kicker: string;
    titulo: string;
    intro: string;
    items: Regalo[];
  };
  libre: {
    kicker: string;
    titulo: string;
    texto: string;
    sugeridos: number[];
  };
  pie: {
    despedida: string;
    detalle: string;
    correo: string;
  };
  opciones: Opciones;
};

/** Nombre mostrado de la pareja: "Antonia & Cristóbal". */
export function nombrePareja(c: Contenido): string {
  return `${c.pareja.nombreUno} & ${c.pareja.nombreDos}`;
}

/** Id corto y único para ítems nuevos creados desde el editor. */
export function nuevoId(prefijo: string): string {
  return `${prefijo}-${Math.random().toString(36).slice(2, 9)}`;
}
