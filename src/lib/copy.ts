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

  mapa: {
    titulo: 'Mapa del lugar de la boda',
  },

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
    verTodos: (n: number) => `Ver los ${n} regalos`,
    verMenos: 'Ver menos',
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
        correoAyuda: 'Solo para poder agradecerte.',
        mensaje: 'Tu mensaje',
      },
      continuar: 'Continuar',
    },
    transferencia: {
      aria: 'Datos para tu aporte',
      kicker: 'Paso 2 de 2',
      titulo: 'Datos para tu aporte',
      texto: 'Transfiere desde la app de tu banco y vuelve acá para avisarnos.',
      monto: 'Monto',
      campos: {
        titular: 'Nombre',
        rut: 'RUT',
        banco: 'Banco',
        tipo: 'Tipo de cuenta',
        numero: 'Número de cuenta',
        correo: 'Correo',
      },
      copiar: 'Copiar',
      copiado: 'Copiado',
      copiarTodo: 'Copiar todos los datos',
      copiadoTodo: 'Datos copiados',
      pendienteTitulo: 'Muy pronto.',
      pendienteTexto: ' Estamos terminando de publicar los datos para transferir. Vuelve en unos días, por favor.',
      tarjeta: '¿Prefieres pagar con tarjeta?',
      tarjetaAyuda: (monto: string) => `Se abre en otra pestaña. Escribe ${monto} como monto.`,
      avisar: 'Ya hice mi aporte',
      enviando: 'Enviando…',
      sinConectar: 'El aviso todavía no está conectado. Escríbenos directamente, por favor.',
      errorEnvio: 'No pudimos enviar tu aviso. Inténtalo de nuevo en un momento.',
    },
    listo: {
      aria: 'Regalo enviado',
      gracias: '¡Gracias!',
      titulo: (nombre: string) => `Gracias, ${nombre}.`,
      texto: 'Ya nos llegó tu mensaje. Gracias por acompañarnos en este comienzo; lo vamos a atesorar.',
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
