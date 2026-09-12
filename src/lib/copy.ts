/**
 * Todo el texto visible del sitio, en español de Chile.
 * Regla de la espec: el copy vive acá o en el componente, nunca dentro de la lógica.
 */
export const COPY = {
  pareja: 'Antonia & Cristóbal',

  nav: [
    { texto: 'La boda', href: '#boda' },
    { texto: 'Los regalos', href: '#regalos' },
    { texto: 'Aporte libre', href: '#libre' },
  ],

  portada: {
    kicker: 'Nos casamos',
    nombreUno: 'Antonia',
    conjuncion: 'y',
    nombreDos: 'Cristóbal',
    datos: [
      { kicker: 'Fecha', valor: '21.11.2026', numerico: true },
      { kicker: 'Lugar', valor: 'Casablanca', numerico: false },
      { kicker: 'Hora', valor: '17:00', numerico: true },
    ],
    cita:
      'Siete años arrendando y por fin tenemos casa. Está bastante vacía, pero no queremos tres jugueras. Armamos esta lista con las cosas que de verdad vamos a usar y los viajes que llevamos años prometiéndonos.',
    firma: '— los dos, desde el living sin sillón',
    foto: {
      especificacion: 'foto principal · 1920×1080',
      pie: 'La casa nueva, el primer día',
      alt: 'Antonia y Cristóbal en la casa nueva el primer día',
    },
  },

  boda: {
    kicker: 'Lo que necesitas saber',
    titulo: 'La boda',
    bloques: [
      {
        kicker: 'Ceremonia',
        titulo: 'Viña Matetic',
        texto: 'Ruta 66, Valle de Casablanca. Llega 17:00, empezamos 17:30 en punto.',
      },
      {
        kicker: 'Fiesta',
        titulo: 'Misma viña',
        texto: 'Cóctel en la terraza, cena a las 20:00, música hasta que aguanten.',
      },
      {
        kicker: 'Vestimenta',
        titulo: 'Formal de jardín',
        texto: 'El pasto es pasto: los tacos aguja se hunden. Trae otro par para bailar.',
      },
      {
        kicker: 'Traslado',
        titulo: 'Bus desde Santiago',
        texto: 'Sale 15:00 desde Metro Manquehue, vuelve a las 03:00. Avísanos si lo tomas.',
      },
    ],
    enlace: { texto: 'Cómo llegar', href: 'https://maps.google.com/?q=Vi%C3%B1a+Matetic+Casablanca' },
  },

  regalos: {
    kicker: 'La lista',
    titulo: 'Cosas que sí vamos a usar',
    intro: 'Cada regalo se completa entre varios invitados. Elige cuántas partes quieres cubrir.',
    ordenarLabel: 'Ordenar',
    opcionesOrden: [
      { valor: 'original', texto: 'Orden sugerido' },
      { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
      { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
      { valor: 'faltan', texto: 'Los que más faltan' },
      { valor: 'nombre-asc', texto: 'Nombre A–Z' },
    ],
    regalar: 'Regalar',
    completo: 'Completo',
    completoGracias: 'Completo — gracias',
    avance: (cubierto: number, objetivo: number) => `${cubierto} de ${objetivo} regalados`,
    agregarParte: (nombre: string) => `Agregar una parte de ${nombre}`,
    quitarParte: (nombre: string) => `Quitar una parte de ${nombre}`,
    fotoAlt: (nombre: string) => `Foto de ${nombre}`,
    fotoEspecificacion: 'foto · 1:1',
  },

  libre: {
    kicker: 'Sin elegir nada de la lista',
    titulo: 'Aporte libre',
    texto:
      'Si prefieres no elegir, también sirve. Pon el monto que quieras y lo usamos en lo que más falte.',
    sugeridosLabel: 'Montos sugeridos',
    sugeridos: [20000, 30000, 50000, 100000],
    inputLabel: 'Otro monto',
    inputPlaceholder: 'Otro monto',
    agregar: 'Agregar aporte',
    etiquetaLinea: 'Aporte libre',
  },

  barra: {
    region: 'Tu regalo',
    kicker: 'Estás regalando',
    elegidos: (n: number) => (n === 1 ? '1 regalo elegido' : `${n} regalos elegidos`),
    vaciar: 'Vaciar',
    continuar: 'Continuar',
  },

  checkout: {
    total: 'Total',
    volver: 'Volver',
    mensaje: {
      aria: 'Déjanos un mensaje',
      kicker: 'Paso 1 de 2',
      titulo: 'Déjanos un mensaje',
      texto: 'Va junto a tu regalo. Es lo primero que vamos a leer.',
      campos: {
        nombre: 'Tu nombre',
        correo: 'Tu correo',
        correoAyuda: 'Solo para el comprobante y para agradecerte.',
        mensaje: 'Tu mensaje',
      },
      continuar: 'Ir a pagar',
    },
    confirmar: {
      aria: 'Confirma tu regalo',
      kicker: 'Paso 2 de 2',
      titulo: 'Confirma tu regalo',
      texto: 'Te llevamos a un sitio de pago seguro.',
      pagar: 'Pagar ahora',
      metodos: ['Webpay', 'Transferencia', 'Servipag', 'Mercado Pago'],
    },
    pasarela: {
      aria: 'Conectando con la pasarela',
      titulo: 'Conectando con la pasarela',
      notaTitulo: 'Maqueta.',
      notaTexto:
        ' Acá va el redirect real a Flow, Webpay o Mercado Pago. No se cobra nada.',
    },
    listo: {
      aria: 'Regalo enviado',
      gracias: '¡Gracias!',
      titulo: (nombre: string) => `Gracias, ${nombre}.`,
      texto:
        'Te llega el comprobante al correo. Antonia y Cristóbal reciben tu mensaje apenas se confirme el pago.',
      volverLista: 'Volver a la lista',
    },
  },

  errores: {
    nombreVacio: 'Necesitamos tu nombre para saber de quién es el regalo.',
    correoVacio: 'Sin correo no podemos enviarte el comprobante.',
    correoFormato: 'Revisa el formato del correo.',
    mensajeVacio: 'Escribe algo, aunque sea corto.',
  },

  pie: {
    despedida: 'Nos vemos en noviembre',
    detalle: 'Antonia & Cristóbal · 21 de noviembre de 2026 · Valle de Casablanca',
    correo: 'hola@antoniaycristobal.cl',
  },
} as const;
