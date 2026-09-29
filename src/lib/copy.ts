/**
 * Texto de la interfaz, en español de Chile.
 *
 * Acá vive solo lo que NO es editable por los novios: etiquetas de botones,
 * el checkout, los mensajes de validación y los textos de accesibilidad. El
 * contenido de la boda (nombres, fecha, bloques, regalos) vive en
 * `src/contenido/` y se edita desde el Modo edición.
 */
export const COPY = {
  nav: [
    { texto: 'La boda', href: '#boda' },
    { texto: 'Confirmar', href: '#confirmar' },
    { texto: 'Los regalos', href: '#regalos' },
  ],

  foto: {
    especificacionRegalo: 'foto · 1:1',
    altRegalo: (nombre: string) => `Foto de ${nombre}`,
  },

  regalos: {
    ordenarLabel: 'Ordenar',
    opcionesOrden: [
      { valor: 'original', texto: 'Orden sugerido', corto: 'Sugerido' },
      { valor: 'precio-asc', texto: 'Precio: menor a mayor', corto: 'Menor precio' },
      { valor: 'precio-desc', texto: 'Precio: mayor a menor', corto: 'Mayor precio' },
      { valor: 'faltan', texto: 'Los que más faltan', corto: 'Los que faltan' },
      { valor: 'nombre-asc', texto: 'Nombre A–Z', corto: 'A–Z' },
    ],
    aportar: 'Aportar',
    sugerido: (monto: string) => `Sugerido ${monto}`,
    aporteLabel: (nombre: string) => `Tu aporte para ${nombre}`,
    quitarAporte: 'Quitar',
    regalar: 'Regalar',
    completo: 'Completo',
    completoGracias: 'Completo — gracias',
    avance: (cubierto: number, objetivo: number) => `${cubierto} de ${objetivo} regalados`,
    agregarParte: (nombre: string) => `Agregar un aporte a ${nombre}`,
    quitarParte: (nombre: string) => `Quitar un aporte a ${nombre}`,
  },

  libre: {
    inputLabel: 'Monto del aporte',
    inputPlaceholder: 'Monto',
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
      notaTexto: ' Acá va el redirect real a Flow, Webpay o Mercado Pago. No se cobra nada.',
    },
    listo: {
      aria: 'Regalo enviado',
      gracias: '¡Gracias!',
      titulo: (nombre: string) => `Gracias, ${nombre}.`,
      texto: 'Te llega el comprobante al correo. Los novios reciben tu mensaje apenas se confirme el pago.',
      volverLista: 'Volver a la lista',
    },
  },

  errores: {
    nombreVacio: 'Necesitamos tu nombre para saber de quién es el regalo.',
    correoVacio: 'Sin correo no podemos enviarte el comprobante.',
    correoFormato: 'Revisa el formato del correo.',
    mensajeVacio: 'Escribe algo, aunque sea corto.',
  },
} as const;
