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
        id: 'bloque-matrimonio',
        kicker: 'Matrimonio',
        titulo: '18:30 a 00:00 hrs',
        texto:
          'Les esperamos desde las 18:30 hrs. Comenzamos a las 19:00 hrs en punto, así que no se atrasen, y celebramos juntos hasta las 00:00 hrs.',
      },
      {
        id: 'bloque-plan',
        kicker: 'Plan de boda',
        titulo: 'Mucho que celebrar',
        texto: 'Habrá cóctel, brindis, juegos, competencias y, por supuesto, ¡fiesta!',
      },
      {
        id: 'bloque-vestimenta',
        kicker: 'Vestimenta',
        titulo: 'Pasto y pista',
        texto:
          'La ceremonia será al aire libre, sobre pasto: los tacos aguja se hunden. Algunas actividades y la fiesta serán bajo techo con piso firme, así que trae un par de recambio para bailar.',
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
    titulo: 'Nuestro primer hogar',
    intro:
      'Que nos acompañen en este día ya es el regalo más grande. Si además quieren ayudarnos a armar nuestro primer hogar, no hace falta comprar nada: cualquier aporte, del monto que sea, lo recibiremos con muchísimo cariño y gratitud. Estas son las cosas en que lo usaremos.',
    items: [
      {
        id: 'electrodomesticos',
        nombre: 'Electrodomésticos',
        nota: 'Lavadora, microondas, tostador y todo lo que hace andar la casa.',
        precio: 0,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'cocina',
        nombre: 'Utensilios de cocina',
        nota: 'Ollas, servicios, platos, cucharones y todo lo de la cocina.',
        precio: 0,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'muebles',
        nombre: 'Muebles y decoración',
        nota: 'Mesas, sillas y los detalles que la harán sentirse nuestra.',
        precio: 0,
        objetivo: null,
        regalados: 0,
      },
      {
        id: 'ropa-blanca',
        nombre: 'Ropa blanca',
        nota: 'Sábanas, toallas, cojines y cortinas.',
        precio: 0,
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
    mostrarNotas: true,
    estiloFoto: 'polaroid',
    acento: '#B06E6E',
  },
};
