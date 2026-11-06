/**
 * Recibe la asistencia y los avisos de aporte del sitio y los guarda en esta
 * planilla, una pestaña para cada uno.
 *
 * Se pega en Extensiones → Apps Script de la planilla y se implementa como
 * aplicación web (los pasos están en el README del repositorio).
 *
 * La URL de la aplicación es pública: cualquiera que la conozca puede mandar
 * filas. Por eso acá se valida todo, se corta lo largo y se neutralizan las
 * fórmulas, y hay un tope de envíos por hora.
 */

/** Manda un correo por cada aporte avisado. */
const AVISAR_APORTES_POR_CORREO = true;

/** Quién recibe ese correo. Vacío = la cuenta dueña de la planilla. */
const CORREO_AVISOS = 'jjose.bustos.f@gmail.com';

/** Tope de envíos por hora entre todos los invitados, contra el spam. */
const MAXIMO_POR_HORA = 60;

const HOJAS = {
  asistencia: {
    nombre: 'Asistencia',
    columnas: ['Fecha', 'Nombre', 'Apellido', 'Contacto', '¿Asiste?'],
    campos: ['nombre', 'apellido', 'contacto', 'asiste'],
  },
  aportes: {
    nombre: 'Aportes',
    columnas: ['Fecha', 'Nombre', 'Correo', 'Total (CLP)', 'Detalle', 'Mensaje', '¿Llegó la transferencia?'],
    campos: ['nombre', 'correo', 'total', 'detalle', 'mensaje'],
  },
};

const LARGO_MAXIMO = { mensaje: 2000, detalle: 2000 };

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const hoja = HOJAS[datos.hoja];
    if (!hoja) return responder(false);
    if (!dentroDelTope()) return responder(false);

    const valores = hoja.campos.map(function (campo) {
      return limpiar(datos[campo], LARGO_MAXIMO[campo] || 200);
    });
    if (!valores[0]) return responder(false);

    const candado = LockService.getScriptLock();
    candado.waitLock(10000);
    try {
      const fila = [new Date()].concat(valores);
      if (datos.hoja === 'aportes') fila.push('');
      obtenerHoja(hoja).appendRow(fila);
    } finally {
      candado.releaseLock();
    }

    if (datos.hoja === 'aportes' && AVISAR_APORTES_POR_CORREO) avisarAporte(valores);
    return responder(true);
  } catch (error) {
    console.error(error);
    return responder(false);
  }
}

/** Texto plano, cortado, y sin que Sheets lo pueda leer como fórmula. */
function limpiar(valor, largo) {
  if (typeof valor === 'number' && isFinite(valor)) return valor;
  const texto = String(valor == null ? '' : valor).trim().slice(0, largo);
  return /^[=+\-@\t\r]/.test(texto) ? "'" + texto : texto;
}

function dentroDelTope() {
  const cache = CacheService.getScriptCache();
  const clave = 'envios-' + Math.floor(Date.now() / 3600000);
  const n = Number(cache.get(clave) || 0) + 1;
  cache.put(clave, String(n), 3600);
  return n <= MAXIMO_POR_HORA;
}

function obtenerHoja(hoja) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let pestaña = libro.getSheetByName(hoja.nombre);
  if (!pestaña) {
    pestaña = libro.insertSheet(hoja.nombre);
    pestaña.appendRow(hoja.columnas);
    pestaña.getRange(1, 1, 1, hoja.columnas.length).setFontWeight('bold');
    pestaña.setFrozenRows(1);
  }
  return pestaña;
}

function avisarAporte(valores) {
  const nombre = valores[0];
  const correo = valores[1];
  const total = valores[2];
  const detalle = valores[3];
  const mensaje = valores[4];
  const monto = typeof total === 'number' ? '$' + total.toLocaleString('es-CL') : total;
  MailApp.sendEmail({
    to: CORREO_AVISOS || Session.getEffectiveUser().getEmail(),
    subject: ('Aporte de ' + nombre + ' · ' + monto).replace(/\s+/g, ' '),
    body:
      nombre + ' (' + correo + ') avisó un aporte de ' + monto + '.\n\n' +
      detalle + '\n\nMensaje:\n' + mensaje + '\n\n' +
      'Revisa en la cartola que la transferencia haya llegado.',
  });
}

function responder(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
