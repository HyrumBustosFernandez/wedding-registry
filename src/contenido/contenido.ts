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
    firma: 'La definición de mi lugar Feliz',
  },

  boda: {
    kicker: 'Lo que necesitas saber',
    titulo: 'La boda',
    bloques: [
      {
        id: 'bloque-matrimonio',
        kicker: 'Matrimonio',
        titulo: '18:30 a 00:00 hrs',
        texto: 'Les esperamos a las 18:30 en el lugar. Comenzamos 19:00 hrs en punto y termina 00:00 hrs.',
      },
      {
        id: 'bloque-plan',
        kicker: 'Plan de boda',
        titulo: 'Mucho que celebrar',
        texto: 'Habrá coctel, brindis, juegos, competiciones y fiesta.',
      },
      {
        id: 'bloque-vestimenta',
        kicker: 'Vestimenta',
        titulo: 'Pasto y pista',
        texto:
          'La boda será al aire libre en pasto. Recuerda que los tacos aguja se hunden! Algunas actividades y la fiesta serán realizadas por cada uno. ¡Trae otro par!',
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

  pago: {
    /* Los datos que se muestran para transferir. Completa todos antes de
       publicar; mientras `numero` esté vacío, el sitio avisa que vienen pronto. */
    cuenta: {
      titular: 'JOSE JARED BUSTOS',
      rut: '21.664.429-8',
      banco: 'Banco BCI',
      tipo: 'Cuenta Corriente',
      numero: '69582414',
      correo: 'jjose.bustos.f@gmail.com',
    },
    /* Opcional: link de Mercado Pago (u otro) para quien prefiera tarjeta. */
    linkTarjeta: '',
  },

  confirmacion: {
    kicker: 'Cuéntanos',
    titulo: '¡Confirma si podrás acompañarnos!',
    texto: 'Nos ayuda muchísimo saberlo con tiempo para organizar todo.',
  },

  canciones: {
    kicker: 'La fiesta',
    titulo: '¿Qué canción no puede faltar?',
    texto: 'Ayúdanos a armar la música de la noche.',
    campo: '¡Ingresa aquí la canción, álbum o artista que quieras!',
    boton: 'Enviar canción',
  },

  registro: {
    /* La URL de la aplicación web del Apps Script, la que termina en /exec.
       Los pasos para obtenerla están en el README. */
    url: 'https://script.google.com/macros/s/AKfycbyl98xfBpkfYg4JBmwI3issBKsoae-wh9kdPfF9wrSg_Ch-QMK1UNTEHvwbX0DmKwrpvw/exec',
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
