import type { Contenido } from './esquema';
import { VERSION_ESQUEMA } from './esquema';

/**
 * Contenido inicial: lo que se ve mientras los novios no hayan guardado nada.
 * Sale de ESPEC-DISENO.md. Todo esto es editable desde el Modo edición, así que
 * funciona como ejemplo de relleno, no como dato definitivo.
 */
export const SEMILLA: Contenido = {
  version: VERSION_ESQUEMA,

  pareja: { nombreUno: 'Antonia', conjuncion: 'y', nombreDos: 'Cristóbal' },

  portada: {
    kicker: 'Nos casamos',
    datos: [
      { id: 'dato-fecha', kicker: 'Fecha', valor: '21.11.2026', numerico: true },
      { id: 'dato-lugar', kicker: 'Lugar', valor: 'Casablanca', numerico: false },
      { id: 'dato-hora', kicker: 'Hora', valor: '17:00', numerico: true },
    ],
    cita:
      'Siete años arrendando y por fin tenemos casa. Está bastante vacía, pero no queremos tres jugueras. Armamos esta lista con las cosas que de verdad vamos a usar y los viajes que llevamos años prometiéndonos.',
    firma: '— los dos, desde el living sin sillón',
    foto: null,
  },

  boda: {
    kicker: 'Lo que necesitas saber',
    titulo: 'La boda',
    bloques: [
      {
        id: 'bloque-ceremonia',
        kicker: 'Ceremonia',
        titulo: 'Viña Matetic',
        texto: 'Ruta 66, Valle de Casablanca. Llega 17:00, empezamos 17:30 en punto.',
      },
      {
        id: 'bloque-fiesta',
        kicker: 'Fiesta',
        titulo: 'Misma viña',
        texto: 'Cóctel en la terraza, cena a las 20:00, música hasta que aguanten.',
      },
      {
        id: 'bloque-vestimenta',
        kicker: 'Vestimenta',
        titulo: 'Formal de jardín',
        texto: 'El pasto es pasto: los tacos aguja se hunden. Trae otro par para bailar.',
      },
      {
        id: 'bloque-traslado',
        kicker: 'Traslado',
        titulo: 'Bus desde Santiago',
        texto: 'Sale 15:00 desde Metro Manquehue, vuelve a las 03:00. Avísanos si lo tomas.',
      },
    ],
    enlace: {
      texto: 'Cómo llegar',
      href: 'https://maps.google.com/?q=Vi%C3%B1a+Matetic+Casablanca',
    },
  },

  regalos: {
    kicker: 'La lista',
    titulo: 'Cosas que sí vamos a usar',
    intro: 'Elige lo que quieras regalar y aporta el monto que te acomode.',
    items: [
      { id: 'regalo-japon', nombre: 'Pasajes a Japón', precio: 180000, objetivo: null, regalados: 0, foto: null, nota: 'El viaje que venimos hablando desde la primera cita.' },
      { id: 'regalo-ryokan', nombre: 'Noche en un ryokan', precio: 95000, objetivo: null, regalados: 0, foto: null, nota: 'Dormir en tatami y desayunar mirando un jardín.' },
      { id: 'regalo-cena', nombre: 'La cena de aniversario', precio: 60000, objetivo: null, regalados: 0, foto: null, nota: 'Nos comprometimos a salir a comer cada 21 de noviembre.' },
      { id: 'regalo-sartenes', nombre: 'Sartenes de fierro', precio: 45000, objetivo: null, regalados: 0, foto: null, nota: 'El set que queremos dura cincuenta años.' },
      { id: 'regalo-coreano', nombre: 'Clases de coreano', precio: 35000, objetivo: null, regalados: 0, foto: null, nota: 'Empezamos por los dramas y ya no hay vuelta atrás.' },
      { id: 'regalo-mudanza', nombre: 'La mudanza a la casa', precio: 70000, objetivo: null, regalados: 0, foto: null, nota: 'Camión, cajas y alguien que suba el sillón por la escalera.' },
      { id: 'regalo-termas', nombre: 'Termas de Chillán', precio: 50000, objetivo: null, regalados: 0, foto: null, nota: 'Tres días de agua caliente en septiembre, sin teléfono.' },
      { id: 'regalo-limonero', nombre: 'El limonero del patio', precio: 25000, objetivo: null, regalados: 0, foto: null, nota: 'La idea es hacer pisco sour con sus limones en diez años.' },
      { id: 'regalo-camara', nombre: 'La cámara del viaje', precio: 220000, objetivo: null, regalados: 0, foto: null, nota: 'Para no volver de Japón con puras fotos de celular.' },
    ],
  },

  libre: {
    kicker: 'Sin elegir nada de la lista',
    titulo: 'Aporte libre',
    texto:
      'Si prefieres no elegir, también sirve. Pon el monto que quieras y lo usamos en lo que más falte.',
    sugeridos: [20000, 30000, 50000, 100000],
  },

  pie: {
    despedida: 'Nos vemos en noviembre',
    detalle: 'Antonia & Cristóbal · 21 de noviembre de 2026 · Valle de Casablanca',
    correo: 'hola@antoniaycristobal.cl',
  },

  opciones: {
    /* Apagado: la lista es de aporte voluntario, sin barra ni meta. */
    mostrarMetas: false,
    mostrarMiniaturas: true,
    mostrarNotas: false,
    estiloFoto: 'polaroid',
    acento: '#B06E6E',
  },
};
