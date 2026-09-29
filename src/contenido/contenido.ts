import type { Contenido } from './esquema';
import { VERSION_ESQUEMA } from './esquema';

/**
 * TODO EL CONTENIDO DEL SITIO. Este es el archivo que se edita.
 *
 * Nombres, fecha, lugar, los bloques de la boda, la lista de regalos, el correo
 * de contacto: todo sale de acá. Para cambiar algo, se cambia el texto, se
 * guarda y se despliega.
 *
 * Las fotos van aparte, en `fotos.ts`.
 *
 * Al final del archivo, en `opciones`, están los interruptores: metas por
 * regalo, miniaturas, notas, estilo de foto y color de acento.
 */
export const CONTENIDO: Contenido = {
  version: VERSION_ESQUEMA,

  pareja: { nombreUno: 'Ailyne', conjuncion: 'y', nombreDos: 'Jose' },

  portada: {
    kicker: 'Nos casamos',
    datos: [
      { id: 'dato-fecha', kicker: 'Fecha', valor: '05.02.2027', numerico: true },
      { id: 'dato-hora', kicker: 'Hora', valor: '19:00', numerico: true },
    ],
    cita:
      'Siete años arrendando y por fin tenemos casa. Está bastante vacía, pero no queremos tres jugueras. Armamos esta lista con las cosas que de verdad vamos a usar y los viajes que llevamos años prometiéndonos.',
    firma: '— los dos, desde el living sin sillón',
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
      href: 'https://maps.app.goo.gl/V3K8g8Nxh2FX8VySA?g_st=iw',
    },
  },

  regalos: {
    kicker: 'La lista',
    titulo: 'Cosas que sí vamos a usar',
    intro: 'Elige lo que quieras regalar y aporta el monto que te acomode.',
    items: [
      { id: 'regalo-japon', nombre: 'Pasajes a Japón', precio: 180000, objetivo: null, regalados: 0, nota: 'El viaje que venimos hablando desde la primera cita.' },
      { id: 'regalo-ryokan', nombre: 'Noche en un ryokan', precio: 95000, objetivo: null, regalados: 0, nota: 'Dormir en tatami y desayunar mirando un jardín.' },
      { id: 'regalo-cena', nombre: 'La cena de aniversario', precio: 60000, objetivo: null, regalados: 0, nota: 'Nos comprometimos a salir a comer cada 21 de noviembre.' },
      { id: 'regalo-sartenes', nombre: 'Sartenes de fierro', precio: 45000, objetivo: null, regalados: 0, nota: 'El set que queremos dura cincuenta años.' },
      { id: 'regalo-coreano', nombre: 'Clases de coreano', precio: 35000, objetivo: null, regalados: 0, nota: 'Empezamos por los dramas y ya no hay vuelta atrás.' },
      { id: 'regalo-mudanza', nombre: 'La mudanza a la casa', precio: 70000, objetivo: null, regalados: 0, nota: 'Camión, cajas y alguien que suba el sillón por la escalera.' },
      { id: 'regalo-termas', nombre: 'Termas de Chillán', precio: 50000, objetivo: null, regalados: 0, nota: 'Tres días de agua caliente en septiembre, sin teléfono.' },
      { id: 'regalo-limonero', nombre: 'El limonero del patio', precio: 25000, objetivo: null, regalados: 0, nota: 'La idea es hacer pisco sour con sus limones en diez años.' },
      { id: 'regalo-camara', nombre: 'La cámara del viaje', precio: 220000, objetivo: null, regalados: 0, nota: 'Para no volver de Japón con puras fotos de celular.' },
    ],
  },

  libre: {
    titulo: 'Aporte voluntario',
    boton: 'Agregar',
  },

  confirmacion: {
    kicker: 'Cuéntanos',
    titulo: '¡Confirma si podrás acompañarnos!',
    texto: 'Nos ayuda muchísimo saberlo con tiempo para organizar todo.',
    /* Crea el formulario en formspree.io y pega acá el id de su URL. */
    formspreeId: '',
  },

  pie: {
    despedida: 'Nos vemos en febrero',
    detalle: 'Ailyne & Jose · 5 de febrero de 2027',
    correo: '',
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
