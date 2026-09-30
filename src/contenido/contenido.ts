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

  pareja: { nombreUno: 'Ailyne', conjuncion: 'y', nombreDos: 'José' },

  portada: {
    kicker: 'Nos casamos',
    datos: [
      { id: 'dato-fecha', kicker: 'Fecha', valor: '05.02.2027', numerico: true },
      { id: 'dato-hora', kicker: 'Hora', valor: '19:00', numerico: true },
    ],
    firma: 'La definición de lugar feliz',
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
      consulta: 'Donde Carlitos, Tránsito Guerra 221, Limache, Valparaíso',
    },
  },

  regalos: {
    kicker: 'La lista',
    titulo: 'Cosas que sí vamos a usar',
    intro: 'Elige lo que quieras regalar y aporta el monto que te acomode.',
    items: [
      {
        id: 'plancha',
        nombre: 'La plancha',
        nota: 'Para que la ropa de trabajo deje de ir arrugada.',
        precio: 35000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'sillon',
        nombre: 'El sillón del living',
        nota: 'El mueble que falta desde que nos mudamos.',
        precio: 220000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'sabanas',
        nombre: 'Juego de sábanas',
        nota: 'Dos juegos, para poder lavar uno y dormir con el otro.',
        precio: 55000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'batidora',
        nombre: 'La batidora',
        nota: 'Ella hace queques, yo lavo el bol.',
        precio: 70000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'ollas',
        nombre: 'Set de ollas',
        nota: 'Tenemos tres sartenes y ninguna olla grande.',
        precio: 95000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'lampara',
        nombre: 'Lámpara de pie',
        nota: 'El living tiene una sola luz y es del techo.',
        precio: 45000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'aspiradora',
        nombre: 'La aspiradora',
        nota: 'Con el perro en casa dejó de ser opcional.',
        precio: 120000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'vajilla',
        nombre: 'Vajilla para seis',
        nota: 'Para cuando vengan a vernos y seamos más de cuatro.',
        precio: 80000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'tostadora',
        nombre: 'La tostadora',
        nota: 'Todas las mañanas, sin excepción.',
        precio: 30000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'alfombra',
        nombre: 'Alfombra del living',
        nota: 'El piso es frío y en julio se nota.',
        precio: 65000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'espejo',
        nombre: 'Espejo de cuerpo entero',
        nota: 'Nos vestimos adivinando.',
        precio: 50000,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'hervidor',
        nombre: 'El hervidor',
        nota: 'El nuestro tarda cinco minutos y silba raro.',
        precio: 25000,
        objetivo: null,
        regalados: 0,
      },
    ],
  },

  libre: {
    titulo: 'Aporte voluntario',
    texto:
      'Nos complace mucho que seas parte de este hermoso momento en nuestras vidas. Si te gustaría seguir apoyándonos en esta nueva etapa, estaríamos muy agradecidos.',
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
    detalle: 'Ailyne & José · 5 de febrero de 2027',
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
