/** Un regalo de la lista. `precio` es el precio de UNA parte, no del total. */
export type Regalo = {
  id: number;
  nombre: string;
  /** CLP por parte. */
  precio: number;
  /** Número total de partes en que se divide el regalo. */
  objetivo: number;
  /** Partes ya cubiertas al cargar (semilla de demo; en producción viene del backend). */
  regalados: number;
  nota: string;
};

/* El ítem 3 arranca completo (4/4) a propósito: hay que poder ver el estado "Completo". */
export const REGALOS: readonly Regalo[] = [
  {
    id: 1,
    nombre: 'Pasajes a Japón',
    precio: 180000,
    objetivo: 6,
    regalados: 2,
    nota: 'El viaje que venimos hablando desde la primera cita. Cada aporte cubre un tramo.',
  },
  {
    id: 2,
    nombre: 'Noche en un ryokan',
    precio: 95000,
    objetivo: 3,
    regalados: 1,
    nota: 'Dormir en tatami y desayunar mirando un jardín. Dos noches si nos va bien.',
  },
  {
    id: 3,
    nombre: 'La cena de aniversario',
    precio: 60000,
    objetivo: 4,
    regalados: 4,
    nota: 'Nos comprometimos a salir a comer cada 21 de noviembre. Esta es la primera.',
  },
  {
    id: 4,
    nombre: 'Sartenes de fierro',
    precio: 45000,
    objetivo: 5,
    regalados: 1,
    nota: 'Cristóbal cocina, Antonia prueba. El set que queremos dura cincuenta años.',
  },
  {
    id: 5,
    nombre: 'Clases de coreano',
    precio: 35000,
    objetivo: 8,
    regalados: 3,
    nota: 'Empezamos por los dramas y ya no hay vuelta atrás. Un mes para los dos.',
  },
  {
    id: 6,
    nombre: 'La mudanza a la casa',
    precio: 70000,
    objetivo: 4,
    regalados: 0,
    nota: 'Camión, cajas y alguien que suba el sillón por la escalera.',
  },
  {
    id: 7,
    nombre: 'Termas de Chillán',
    precio: 50000,
    objetivo: 6,
    regalados: 2,
    nota: 'Tres días de agua caliente en septiembre, sin teléfono.',
  },
  {
    id: 8,
    nombre: 'El limonero del patio',
    precio: 25000,
    objetivo: 10,
    regalados: 6,
    nota: 'Chico ahora, pero la idea es hacer pisco sour con sus limones en diez años.',
  },
  {
    id: 9,
    nombre: 'La cámara del viaje',
    precio: 220000,
    objetivo: 5,
    regalados: 1,
    nota: 'Para no volver de Japón con puras fotos de celular.',
  },
];
